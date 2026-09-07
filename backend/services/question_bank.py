# Real interview questions curated from actual HR & Technical interviews
# Sources: Common patterns from Google, Amazon, Microsoft, TCS, Infosys, Wipro, etc.

HR_QUESTIONS = [
    # Self Introduction & Background
    "Tell me about yourself.",
    "Walk me through your resume.",
    "Why are you interested in this role?",
    "Why do you want to work at our company?",
    "What do you know about our company?",
    "Where do you see yourself in 5 years?",
    "What are your short-term and long-term career goals?",
    "Why are you leaving your current job?",
    "Why should we hire you?",
    "What makes you the best candidate for this position?",

    # Strengths & Weaknesses
    "What are your greatest strengths?",
    "What is your biggest weakness?",
    "How do you handle criticism?",
    "What is your greatest professional achievement?",
    "Describe a challenge you faced and how you overcame it.",
    "Tell me about a time you failed. What did you learn?",
    "What motivates you?",
    "How do you handle stress and pressure?",
    "Are you a team player or do you prefer working alone?",
    "How do you prioritize your work when you have multiple deadlines?",

    # Behavioral (STAR-based)
    "Tell me about a time you worked in a team to achieve a goal.",
    "Describe a situation where you had to deal with a difficult colleague.",
    "Give an example of a time you showed leadership.",
    "Tell me about a time you went above and beyond for a project.",
    "Describe a situation where you had to learn something quickly.",
    "Tell me about a time you disagreed with your manager. How did you handle it?",
    "Give an example of a time you managed multiple projects simultaneously.",
    "Tell me about a time you made a mistake. How did you fix it?",
    "Describe a time when you had to adapt to a major change.",
    "Tell me about a time you had to persuade someone to see your point of view.",

    # Work Style & Culture
    "How do you handle tight deadlines?",
    "Describe your ideal work environment.",
    "How do you stay updated with industry trends?",
    "What kind of management style do you prefer?",
    "How do you give feedback to teammates?",
    "Tell me about a time you received constructive feedback. How did you react?",
    "What do you do when you disagree with a decision made by leadership?",
    "How do you ensure work-life balance?",
    "Are you comfortable with remote work / hybrid work?",
    "What do you do to keep yourself motivated on repetitive tasks?",

    # Situational
    "If you were given a project with no clear instructions, what would you do?",
    "If two deadlines conflict, how do you decide which to prioritize?",
    "What would you do if a team member was not contributing to the project?",
    "How would you handle a situation where you don't know the answer?",
    "If a client is unhappy with your work, how do you handle it?",
    "What would you do in your first 30 days on this job?",
    "How would you handle working with someone who has a very different work style?",
    "If you had unlimited resources, what project would you want to work on?",
    "You realize your manager made an error in a decision. What do you do?",
    "How would you handle being asked to do something unethical?",

    # Closing
    "What are your salary expectations?",
    "When can you start?",
    "Are you interviewing with other companies?",
    "What questions do you have for us?",
    "What do you enjoy doing outside of work?",
    "How do you define success?",
    "What is the most important thing you look for in a job?",
    "Describe your dream job.",
    "What is something you wish you had done differently in your career?",
    "What legacy do you want to leave in your career?",
]

TECHNICAL_QUESTIONS = [
    # Data Structures
    "What is the difference between an array and a linked list?",
    "Explain the difference between a stack and a queue with examples.",
    "What is a binary search tree? How is insertion done?",
    "What is the time complexity of searching in a hash table?",
    "Explain the difference between BFS and DFS.",
    "What is a heap data structure? What are its applications?",
    "How does a hash map handle collisions?",
    "What is the difference between a tree and a graph?",
    "Explain the concept of dynamic programming with an example.",
    "What is a trie data structure and when is it used?",
    "What is the difference between a doubly linked list and a singly linked list?",
    "Explain AVL trees and why they are used.",
    "What is a segment tree and when would you use it?",
    "How does quicksort work? What is its average time complexity?",
    "Explain merge sort and its time complexity.",

    # Algorithms
    "What is the difference between greedy and dynamic programming?",
    "Explain binary search. Write the algorithm.",
    "What is the two-pointer technique? Give an example problem.",
    "Explain the sliding window algorithm with an example.",
    "What is topological sorting? Where is it used?",
    "Explain Dijkstra's algorithm for shortest path.",
    "What is the difference between O(n) and O(n log n)?",
    "Explain the concept of recursion with an example.",
    "What is memoization and how does it improve performance?",
    "How do you detect a cycle in a linked list?",
    "Write a function to reverse a linked list.",
    "How do you find the middle of a linked list?",
    "What is the LRU cache and how is it implemented?",
    "Explain the concept of backtracking with N-Queens problem.",
    "How do you check if a binary tree is balanced?",

    # Object Oriented Programming
    "What are the four pillars of OOP?",
    "Explain polymorphism with an example.",
    "What is the difference between abstraction and encapsulation?",
    "What is inheritance? What are its types?",
    "What is the difference between an interface and an abstract class?",
    "Explain the SOLID principles.",
    "What is method overloading vs method overriding?",
    "What is a design pattern? Name and explain 3 common ones.",
    "What is the Singleton design pattern?",
    "Explain the Factory design pattern.",

    # Database
    "What is the difference between SQL and NoSQL?",
    "Explain normalization and its types (1NF, 2NF, 3NF).",
    "What is a primary key vs a foreign key?",
    "What is an index in a database? How does it improve performance?",
    "What is a JOIN? Explain different types of JOINs.",
    "What is ACID in databases?",
    "What is the difference between DELETE, TRUNCATE, and DROP?",
    "Write a SQL query to find the second highest salary.",
    "What is a stored procedure?",
    "What is database sharding?",

    # Operating Systems & Networking
    "What is a process vs a thread?",
    "What is a deadlock? How do you prevent it?",
    "Explain virtual memory.",
    "What is the difference between TCP and UDP?",
    "What happens when you type a URL in a browser?",
    "What is REST API? What are HTTP methods?",
    "What is the difference between GET and POST?",
    "What is a microservices architecture?",
    "What is load balancing?",
    "Explain the difference between monolithic and microservices architecture.",

    # System Design
    "How would you design a URL shortener like bit.ly?",
    "How would you design a chat application?",
    "How would you design a rate limiter?",
    "What is caching and when should you use it?",
    "How would you design a notification system?",
    "What is CAP theorem?",
    "How would you handle 1 million requests per second?",
    "Explain horizontal vs vertical scaling.",
    "What is a CDN and how does it work?",
    "How would you design a file storage system like Google Drive?",

    # Coding Problems (commonly asked)
    "Find two numbers in an array that sum to a target (Two Sum).",
    "Check if a string is a palindrome.",
    "Find the longest substring without repeating characters.",
    "Given a sorted array, find the target using binary search.",
    "Merge two sorted arrays.",
    "Find the maximum subarray sum (Kadane's algorithm).",
    "Count the number of islands in a grid.",
    "Implement a stack using queues.",
    "Find all permutations of a string.",
    "Check if two strings are anagrams.",
]


def get_questions_for_round(round_type: str, count: int = 20):
    """Return a pool of real questions for the given round type."""
    import random
    if round_type == "hr":
        pool = HR_QUESTIONS.copy()
    else:
        pool = TECHNICAL_QUESTIONS.copy()
    random.shuffle(pool)
    return pool[:count]
