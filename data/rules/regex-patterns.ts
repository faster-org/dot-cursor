import { Rule } from "../types";

export const rule: Rule = {
	id: "regex-patterns",
	slug: "regex-patterns",
	title: "Regular Expressions & Pattern Matching",
	description: "Master regular expressions for text processing, validation, and data extraction",
	content: `# Regex Patterns

This document provides comprehensive guidelines for regex patterns development and best practices.

---

## Regex Fundamentals

1. **Literal**
   - Literal characters and metacharacters
   - Implement proper literal characters and metacharacters
   - Follow best practices for optimal results

2. **Character**
   - Character classes and ranges [a-z], [0-9]
   - Implement proper character classes and ranges [a-z], [0-9]
   - Follow best practices for optimal results

3. **Quantifiers**
   - Quantifiers (*, +, ?, {n}, {n,m})
   - Implement proper quantifiers (*, +, ?, {n}, {n,m})
   - Follow best practices for optimal results

4. **Anchors**
   - Anchors (^, $, , B)
   - Implement proper anchors (^, $, , b)
   - Follow best practices for optimal results

5. **Grouping**
   - Grouping and capturing ()
   - Implement proper grouping and capturing ()
   - Follow best practices for optimal results

---

## Character Classes

6. **Predefined**
   - Predefined classes (d, w, s, D, W, S)
   - Implement proper predefined classes (d, w, s, d, w, s)
   - Follow best practices for optimal results

7. **Custom**
   - Custom character classes [abc], [^abc]
   - Implement proper custom character classes [abc], [^abc]
   - Follow best practices for optimal results

8. **POSIX**
   - POSIX character classes [:alpha:], [:digit:]
   - Implement proper posix character classes [:alpha:], [:digit:]
   - Follow best practices for optimal results

9. **Unicode**
   - Unicode categories p{L}, p{N}
   - Implement proper unicode categories p{l}, p{n}
   - Follow best practices for optimal results

10. **Case-insensitive**
   - Case-insensitive matching
   - Implement proper case-insensitive matching
   - Follow best practices for optimal results

---

## Quantifiers & Repetition

11. **Greedy**
   - Greedy quantifiers (*, +, ?, {n,m})
   - Implement proper greedy quantifiers (*, +, ?, {n,m})
   - Follow best practices for optimal results

12. **Lazy/non-greedy**
   - Lazy/non-greedy quantifiers (*?, +?, ??)
   - Implement proper lazy/non-greedy quantifiers (*?, +?, ??)
   - Follow best practices for optimal results

13. **Possessive**
   - Possessive quantifiers (*+, ++, ?+)
   - Implement proper possessive quantifiers (*+, ++, ?+)
   - Follow best practices for optimal results

14. **Exact**
   - Exact repetition {n}
   - Implement proper exact repetition {n}
   - Follow best practices for optimal results

15. **Range**
   - Range repetition {min,max}
   - Implement proper range repetition {min,max}
   - Follow best practices for optimal results

---

## Groups & Capturing

16. **Capturing**
   - Capturing groups ()
   - Implement proper capturing groups ()
   - Follow best practices for optimal results

17. **Non-capturing**
   - Non-capturing groups (?:)
   - Implement proper non-capturing groups (?:)
   - Follow best practices for optimal results

18. **Named**
   - Named capturing groups (?<name>)
   - Implement proper named capturing groups (?<name>)
   - Follow best practices for optimal results

19. **Backreferences**
   - Backreferences \\1, \\2, k<name>
   - Implement proper backreferences \\1, \\2, k<name>
   - Follow best practices for optimal results

20. **Group**
   - Group alternation (|)
   - Implement proper group alternation (|)
   - Follow best practices for optimal results

---

## Lookahead & Lookbehind

21. **Positive**
   - Positive lookahead (?=)
   - Implement proper positive lookahead (?=)
   - Follow best practices for optimal results

22. **Negative**
   - Negative lookahead (?!)
   - Implement proper negative lookahead (?!)
   - Follow best practices for optimal results

23. **Positive**
   - Positive lookbehind (?<=)
   - Implement proper positive lookbehind (?<=)
   - Follow best practices for optimal results

24. **Negative**
   - Negative lookbehind (?<!)
   - Implement proper negative lookbehind (?<!)
   - Follow best practices for optimal results

25. **Conditional**
   - Conditional patterns
   - Implement proper conditional patterns
   - Follow best practices for optimal results

---

## Common Patterns

26. **Email**
   - Email validation patterns
   - Implement proper email validation patterns
   - Follow best practices for optimal results

27. **URL**
   - URL and URI matching
   - Implement proper url and uri matching
   - Follow best practices for optimal results

28. **Phone**
   - Phone number formats
   - Implement proper phone number formats
   - Follow best practices for optimal results

29. **Date**
   - Date and time patterns
   - Implement proper date and time patterns
   - Follow best practices for optimal results

30. **IP**
   - IP address validation
   - Implement proper ip address validation
   - Follow best practices for optimal results

---

## Text Processing

31. **Search**
   - Search and replace operations
   - Implement proper search and replace operations
   - Follow best practices for optimal results

32. **Text**
   - Text extraction and parsing
   - Implement proper text extraction and parsing
   - Follow best practices for optimal results

33. **Data**
   - Data cleaning and normalization
   - Implement proper data cleaning and normalization
   - Follow best practices for optimal results

34. **Log**
   - Log file analysis
   - Implement proper log file analysis
   - Follow best practices for optimal results

35. **CSV**
   - CSV and structured data parsing
   - Implement proper csv and structured data parsing
   - Follow best practices for optimal results

---

## Validation Patterns

36. **Password**
   - Password strength validation
   - Implement proper password strength validation
   - Follow best practices for optimal results

37. **Credit**
   - Credit card number formats
   - Implement proper credit card number formats
   - Follow best practices for optimal results

38. **Social**
   - Social security numbers
   - Implement proper social security numbers
   - Follow best practices for optimal results

39. **Postal**
   - Postal codes and zip codes
   - Implement proper postal codes and zip codes
   - Follow best practices for optimal results

40. **International**
   - International phone formats
   - Implement proper international phone formats
   - Follow best practices for optimal results

---

## Advanced Features

41. **Atomic**
   - Atomic groups (?>)
   - Implement proper atomic groups (?>)
   - Follow best practices for optimal results

42. **Conditional**
   - Conditional expressions (?(condition))
   - Implement proper conditional expressions (?(condition))
   - Follow best practices for optimal results

43. **Recursive**
   - Recursive patterns (?R)
   - Implement proper recursive patterns (?r)
   - Follow best practices for optimal results

44. **Balancing**
   - Balancing groups (in .NET)
   - Implement proper balancing groups (in .net)
   - Follow best practices for optimal results

45. **Inline**
   - Inline modifiers (?i), (?m), (?s)
   - Implement proper inline modifiers (?i), (?m), (?s)
   - Follow best practices for optimal results

---

## Language-Specific

46. **JavaScript**
   - JavaScript regex with flags (g, i, m, s, u, y)
   - Implement proper javascript regex with flags (g, i, m, s, u, y)
   - Follow best practices for optimal results

47. **Python**
   - Python re module features
   - Implement proper python re module features
   - Follow best practices for optimal results

48. **Perl-compatible**
   - Perl-compatible regex (PCRE)
   - Implement proper perl-compatible regex (pcre)
   - Follow best practices for optimal results

49. **Java**
   - Java Pattern and Matcher classes
   - Implement proper java pattern and matcher classes
   - Follow best practices for optimal results

50. **.NET**
   - .NET Regex class capabilities
   - Implement proper .net regex class capabilities
   - Follow best practices for optimal results

---

## Performance Optimization

51. **Catastrophic**
   - Catastrophic backtracking prevention
   - Implement proper catastrophic backtracking prevention
   - Follow best practices for optimal results

52. **Efficient**
   - Efficient pattern design
   - Implement proper efficient pattern design
   - Follow best practices for optimal results

53. **Anchoring**
   - Anchoring for performance
   - Implement proper anchoring for performance
   - Follow best practices for optimal results

54. **Character**
   - Character class optimization
   - Implement proper character class optimization
   - Follow best practices for optimal results

55. **Compilation**
   - Compilation and caching
   - Implement proper compilation and caching
   - Follow best practices for optimal results

---

## Testing & Debugging

56. **Regex**
   - Regex testing tools and websites
   - Implement proper regex testing tools and websites
   - Follow best practices for optimal results

57. **Debugging**
   - Debugging complex patterns
   - Implement proper debugging complex patterns
   - Follow best practices for optimal results

58. **Step-by-step**
   - Step-by-step execution analysis
   - Implement proper step-by-step execution analysis
   - Follow best practices for optimal results

59. **Performance**
   - Performance profiling
   - Implement proper performance profiling
   - Follow best practices for optimal results

60. **Cross-platform**
   - Cross-platform compatibility
   - Implement proper cross-platform compatibility
   - Follow best practices for optimal results

---

## Real-world Applications

61. **Log**
   - Log parsing and analysis
   - Implement proper log parsing and analysis
   - Follow best practices for optimal results

62. **Data**
   - Data validation in forms
   - Implement proper data validation in forms
   - Follow best practices for optimal results

63. **Text**
   - Text search and filtering
   - Implement proper text search and filtering
   - Follow best practices for optimal results

64. **Code**
   - Code syntax highlighting
   - Implement proper code syntax highlighting
   - Follow best practices for optimal results

65. **Configuration**
   - Configuration file parsing
   - Implement proper configuration file parsing
   - Follow best practices for optimal results

---

## Best Practices

66. **Readable**
   - Readable pattern construction
   - Implement proper readable pattern construction
   - Follow best practices for optimal results

67. **Comment**
   - Comment and documentation
   - Implement proper comment and documentation
   - Follow best practices for optimal results

68. **Error**
   - Error handling strategies
   - Implement proper error handling strategies
   - Follow best practices for optimal results

69. **Security**
   - Security considerations
   - Implement proper security considerations
   - Follow best practices for optimal results

70. **Maintainability**
   - Maintainability guidelines
   - Implement proper maintainability guidelines
   - Follow best practices for optimal results

---

## Cross-Platform Considerations

71. **Flavor**
   - Flavor differences (PCRE, POSIX, ECMAScript)
   - Implement proper flavor differences (pcre, posix, ecmascript)
   - Follow best practices for optimal results

72. **Unicode**
   - Unicode support variations
   - Implement proper unicode support variations
   - Follow best practices for optimal results

73. **Performance**
   - Performance characteristics
   - Implement proper performance characteristics
   - Follow best practices for optimal results

74. **Feature**
   - Feature availability
   - Implement proper feature availability
   - Follow best practices for optimal results

75. **Migration**
   - Migration strategies
   - Implement proper migration strategies
   - Follow best practices for optimal results

---

## Summary Checklist

- [ ] Core principles implemented
- [ ] Best practices followed
- [ ] Performance optimized
- [ ] Security measures in place
- [ ] Testing strategy implemented
- [ ] Documentation completed
- [ ] Monitoring configured
- [ ] Production deployment ready

---

Follow these comprehensive guidelines for successful regex patterns implementation.`,
	categories: ["regex", "pattern-matching", "text-processing", "validation"],
	tags: ["regex", "regular-expressions", "pattern-matching", "validation", "text-processing"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",};
