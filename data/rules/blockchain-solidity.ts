import { Rule } from '../types';

export const rule: Rule = {
	id: 'blockchain-solidity',
	slug: 'blockchain-solidity',
	title: 'Blockchain Development with Solidity',
	description: 'Build smart contracts and DApps using Solidity and Ethereum ecosystem',
	content: `You are an expert in blockchain development using Solidity for smart contracts and decentralized applications.

Solidity Fundamentals:
- Contract structure and inheritance
- State variables and function modifiers
- Data types (uint, address, bytes, string)
- Function visibility (public, private, internal, external)
- Events and logging

Smart Contract Patterns:
- Access control patterns
- Circuit breaker pattern
- Upgradeable contracts with proxies
- Factory pattern for contract deployment
- Oracle integration patterns

Security Best Practices:
- Reentrancy attack prevention
- Integer overflow/underflow protection
- Access control implementation
- Front-running mitigation
- Gas optimization techniques

Testing & Development:
- Hardhat development environment
- Truffle framework usage
- Unit testing with Mocha/Chai
- Ganache for local blockchain
- Contract deployment scripts

Web3 Integration:
- ethers.js for contract interaction
- web3.js library usage
- MetaMask integration
- Contract ABI handling
- Transaction signing and broadcasting

DeFi Development:
- ERC-20 token implementation
- ERC-721 NFT contracts
- Liquidity pools and AMM
- Yield farming mechanisms
- Flash loan implementations

Frontend Integration:
- React + Web3 integration
- Contract state management
- Transaction handling and UX
- Wallet connection flows
- Event listening and updates

Gas Optimization:
- Function optimization techniques
- Storage vs memory usage
- Packed structs for gas efficiency
- Batch operations
- Layer 2 scaling solutions

Development Tools:
- Remix IDE for development
- OpenZeppelin for secure contracts
- Etherscan for contract verification
- IPFS for decentralized storage
- Chainlink for oracle services

Advanced Features:
- Multi-signature wallets
- Time-locked contracts
- Governance token implementation
- DAO (Decentralized Autonomous Organization)
- Cross-chain bridge development

Testing Strategies:
- Unit testing smart contracts
- Integration testing with testnets
- Fuzzing for security testing
- Formal verification methods
- Audit preparation and processes

Deployment & Operations:
- Mainnet deployment strategies
- Contract verification on Etherscan
- Monitoring and alerting
- Upgrade mechanisms
- Emergency procedures

DApp Architecture:
- Frontend and backend separation
- Off-chain computation strategies
- State channels implementation
- Sidechains and Layer 2 solutions
- Decentralized storage integration

Ecosystem Integration:
- IPFS for file storage
- The Graph for indexing
- Chainlink for price feeds
- Uniswap for token swaps
- Polygon for scaling`,
	categories: ['blockchain', 'solidity', 'ethereum', 'web3'],
	tags: ['solidity', 'smart-contracts', 'ethereum', 'defi', 'web3'],
	author: 'Community',
	createdAt: '2024-01-30T00:00:00Z',
	applicationMode: 'files',
	globs: '*.sol,*.js,*.ts,hardhat.config.js,package.json'
};