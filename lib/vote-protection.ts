import { LRUCache } from "lru-cache";
import { NextRequest } from "next/server";
import { getClientIdentifier } from "./rate-limit";

// In-memory cache for vote tracking
// This prevents rapid vote switching and tracks recent voting patterns
const voteCache = new LRUCache<string, VoteRecord>({
	max: 10000, // Maximum 10k unique voters tracked
	ttl: 1000 * 60 * 60 * 24, // 24 hour TTL
});

interface VoteRecord {
	lastVote: "up" | "down" | null;
	lastVoteTime: number;
	voteCount: number;
	rapidChanges: number; // Track rapid vote switching
}

// Check if vote is suspicious
export function checkVotePattern(
	clientId: string,
	ruleSlug: string,
	newVote: "up" | "down" | null
): { allowed: boolean; reason?: string } {
	const key = `${clientId}:${ruleSlug}`;
	const now = Date.now();
	const record = voteCache.get(key);

	if (!record) {
		// First vote from this client for this rule
		voteCache.set(key, {
			lastVote: newVote,
			lastVoteTime: now,
			voteCount: 1,
			rapidChanges: 0,
		});
		return { allowed: true };
	}

	// Check for rapid vote switching (more than 3 changes in 1 minute)
	const timeSinceLastVote = now - record.lastVoteTime;

	if (timeSinceLastVote < 1000) {
		// Less than 1 second between votes
		return {
			allowed: false,
			reason: "Please wait a moment before voting again"
		};
	}

	if (timeSinceLastVote < 60000) {
		// Within 1 minute
		if (record.lastVote !== newVote) {
			record.rapidChanges++;

			if (record.rapidChanges > 3) {
				return {
					allowed: false,
					reason: "Too many vote changes. Please try again later"
				};
			}
		}
	} else {
		// Reset rapid changes counter after 1 minute
		record.rapidChanges = 0;
	}

	// Update record
	record.lastVote = newVote;
	record.lastVoteTime = now;
	record.voteCount++;
	voteCache.set(key, record);

	return { allowed: true };
}

// Get previous vote for a client
export function getPreviousVote(
	clientId: string,
	ruleSlug: string
): "up" | "down" | null {
	const key = `${clientId}:${ruleSlug}`;
	const record = voteCache.get(key);
	return record?.lastVote || null;
}

// Middleware to check vote validity
export function validateVote(
	req: NextRequest,
	ruleSlug: string,
	voteType: "up" | "down" | null
): { valid: boolean; error?: string; previousVote?: "up" | "down" | null } {
	const clientId = getClientIdentifier(req);

	// Get previous vote
	const previousVote = getPreviousVote(clientId, ruleSlug);

	// Check vote pattern
	const patternCheck = checkVotePattern(clientId, ruleSlug, voteType);

	if (!patternCheck.allowed) {
		return {
			valid: false,
			error: patternCheck.reason
		};
	}

	return {
		valid: true,
		previousVote
	};
}