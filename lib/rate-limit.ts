import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";
import crypto from "crypto";

// Initialize Redis client
const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL!,
	token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Different rate limiters for different endpoints
export const rateLimiters = {
	// Voting: 10 requests per minute per IP
	voting: new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(10, "1 m"),
		analytics: true,
		prefix: "ratelimit:voting",
	}),

	// View tracking: 30 requests per minute per IP
	view: new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(30, "1 m"),
		analytics: true,
		prefix: "ratelimit:view",
	}),

	// Copy tracking: 20 requests per minute per IP
	copy: new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(20, "1 m"),
		analytics: true,
		prefix: "ratelimit:copy",
	}),

	// General API: 60 requests per minute per IP
	general: new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(60, "1 m"),
		analytics: true,
		prefix: "ratelimit:general",
	}),
};

// Get client identifier (IP + user agent hash)
export function getClientIdentifier(req: NextRequest): string {
	const forwarded = req.headers.get("x-forwarded-for");
	const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
	const userAgent = req.headers.get("user-agent") || "";

	// Create a hash of IP + user agent for better fingerprinting
	const fingerprint = crypto
		.createHash("sha256")
		.update(ip + userAgent)
		.digest("hex");

	return fingerprint;
}

// Check rate limit
export async function checkRateLimit(
	req: NextRequest,
	limiter: keyof typeof rateLimiters = "general"
) {
	// Skip rate limiting in development if Redis is not configured
	if (
		process.env.NODE_ENV === "development" &&
		(!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN)
	) {
		return { success: true, limit: 999, remaining: 999, reset: Date.now() };
	}

	const identifier = getClientIdentifier(req);
	const { success, limit, remaining, reset } = await rateLimiters[limiter].limit(
		identifier
	);

	return { success, limit, remaining, reset };
}

// Middleware response helper
export function rateLimitResponse(
	success: boolean,
	limit: number,
	remaining: number,
	reset: number
) {
	const headers = {
		"X-RateLimit-Limit": limit.toString(),
		"X-RateLimit-Remaining": remaining.toString(),
		"X-RateLimit-Reset": reset.toString(),
	};

	if (!success) {
		return new Response("Too many requests. Please try again later.", {
			status: 429,
			headers,
		});
	}

	return null; // Continue with request
}