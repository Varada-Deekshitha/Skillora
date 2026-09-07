"""
1500+ Curated Interview Problems — GFG Interview Prep Style
Topics: Arrays, Strings, LinkedList, Stack, Trees, DP, Graphs, and more
"""

PROBLEMS = [
    # =========================================================
    # SECTION 1: ARRAYS  (ids 1 – 150)
    # =========================================================
    {
        "id": 1, "title": "Two Sum", "slug": "two-sum",
        "difficulty": "Easy", "tags": ["Array", "Hash Table"], "acceptance": 49,
        "description": """Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.
Assume exactly one solution exists and you may not use the same element twice.

Example 1: Input: nums=[2,7,11,15], target=9  Output: [0,1]
Example 2: Input: nums=[3,2,4], target=6       Output: [1,2]

Constraints: 2<=nums.length<=10^4, -10^9<=nums[i]<=10^9""",
        "starter": {
            "python": "def twoSum(nums, target):\n    pass\n\nprint(twoSum([2,7,11,15], 9))",
            "javascript": "function twoSum(nums, target) {\n}\nconsole.log(twoSum([2,7,11,15], 9));",
            "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) { return new int[]{}; }\n    public static void main(String[] a) { System.out.println(java.util.Arrays.toString(new Solution().twoSum(new int[]{2,7,11,15},9))); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvector<int> twoSum(vector<int>& n,int t){return {};}\nint main(){auto r=twoSum(*(new vector<int>{2,7,11,15}),9);cout<<r[0]<<\",\"<<r[1];}",
        },
        "test_cases": [{"input": "[2,7,11,15]\n9", "expected": "[0, 1]"}, {"input": "[3,2,4]\n6", "expected": "[1, 2]"}, {"input": "[3,3]\n6", "expected": "[0, 1]"}],
    },
    {
        "id": 2, "title": "Best Time to Buy and Sell Stock", "slug": "best-time-to-buy-sell-stock",
        "difficulty": "Easy", "tags": ["Array", "Dynamic Programming"], "acceptance": 54,
        "description": """Given an array prices where prices[i] is the price on day i, return the maximum profit from one transaction.
If no profit is possible return 0.

Example 1: Input: prices=[7,1,5,3,6,4]  Output: 5  (buy on day 2, sell on day 5)
Example 2: Input: prices=[7,6,4,3,1]    Output: 0  (no profit possible)

Constraints: 1<=prices.length<=10^5, 0<=prices[i]<=10^4""",
        "starter": {
            "python": "def maxProfit(prices):\n    pass\n\nprint(maxProfit([7,1,5,3,6,4]))",
            "javascript": "function maxProfit(prices) {\n}\nconsole.log(maxProfit([7,1,5,3,6,4]));",
            "java": "class Solution {\n    public int maxProfit(int[] prices) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().maxProfit(new int[]{7,1,5,3,6,4})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint maxProfit(vector<int>& p){return 0;}\nint main(){vector<int> p={7,1,5,3,6,4};cout<<maxProfit(p);}",
        },
        "test_cases": [{"input": "[7,1,5,3,6,4]", "expected": "5"}, {"input": "[7,6,4,3,1]", "expected": "0"}, {"input": "[1,2]", "expected": "1"}],
    },
    {
        "id": 3, "title": "Maximum Subarray", "slug": "maximum-subarray",
        "difficulty": "Medium", "tags": ["Array", "Dynamic Programming"], "acceptance": 50,
        "description": """Given an integer array nums, find the contiguous subarray with the largest sum and return its sum (Kadane's Algorithm).

Example 1: Input: nums=[-2,1,-3,4,-1,2,1,-5,4]  Output: 6  (subarray [4,-1,2,1])
Example 2: Input: nums=[1]                         Output: 1

Constraints: 1<=nums.length<=10^5, -10^4<=nums[i]<=10^4""",
        "starter": {
            "python": "def maxSubArray(nums):\n    pass\n\nprint(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))",
            "javascript": "function maxSubArray(nums) {\n}\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));",
            "java": "class Solution {\n    public int maxSubArray(int[] nums) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint maxSubArray(vector<int>& n){return 0;}\nint main(){vector<int> n={-2,1,-3,4,-1,2,1,-5,4};cout<<maxSubArray(n);}",
        },
        "test_cases": [{"input": "[-2,1,-3,4,-1,2,1,-5,4]", "expected": "6"}, {"input": "[1]", "expected": "1"}, {"input": "[-1]", "expected": "-1"}],
    },
    {
        "id": 4, "title": "Contains Duplicate", "slug": "contains-duplicate",
        "difficulty": "Easy", "tags": ["Array", "Hash Table"], "acceptance": 61,
        "description": """Given an integer array nums, return true if any value appears at least twice, false if every element is distinct.

Example 1: Input: nums=[1,2,3,1]   Output: true
Example 2: Input: nums=[1,2,3,4]   Output: false

Constraints: 1<=nums.length<=10^5, -10^9<=nums[i]<=10^9""",
        "starter": {
            "python": "def containsDuplicate(nums):\n    pass\n\nprint(containsDuplicate([1,2,3,1]))",
            "javascript": "function containsDuplicate(nums) {\n}\nconsole.log(containsDuplicate([1,2,3,1]));",
            "java": "class Solution {\n    public boolean containsDuplicate(int[] nums) { return false; }\n    public static void main(String[] a) { System.out.println(new Solution().containsDuplicate(new int[]{1,2,3,1})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nbool containsDuplicate(vector<int>& n){return false;}\nint main(){vector<int> n={1,2,3,1};cout<<containsDuplicate(n);}",
        },
        "test_cases": [{"input": "[1,2,3,1]", "expected": "true"}, {"input": "[1,2,3,4]", "expected": "false"}, {"input": "[1,1,1,3,3,4,3,2,4,2]", "expected": "true"}],
    },
    {
        "id": 5, "title": "Product of Array Except Self", "slug": "product-of-array-except-self",
        "difficulty": "Medium", "tags": ["Array", "Prefix Sum"], "acceptance": 65,
        "description": """Given an integer array nums, return an array answer such that answer[i] equals the product of all elements except nums[i].
Must run in O(n) without using division.

Example 1: Input: nums=[1,2,3,4]  Output: [24,12,8,6]
Example 2: Input: nums=[-1,1,0,-3,3]  Output: [0,0,9,0,0]

Constraints: 2<=nums.length<=10^5""",
        "starter": {
            "python": "def productExceptSelf(nums):\n    pass\n\nprint(productExceptSelf([1,2,3,4]))",
            "javascript": "function productExceptSelf(nums) {\n}\nconsole.log(productExceptSelf([1,2,3,4]));",
            "java": "class Solution {\n    public int[] productExceptSelf(int[] nums) { return new int[]{}; }\n    public static void main(String[] a) { System.out.println(java.util.Arrays.toString(new Solution().productExceptSelf(new int[]{1,2,3,4}))); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvector<int> productExceptSelf(vector<int>& n){return {};}\nint main(){vector<int> n={1,2,3,4};for(auto x:productExceptSelf(n))cout<<x<<\" \";}",
        },
        "test_cases": [{"input": "[1,2,3,4]", "expected": "[24, 12, 8, 6]"}, {"input": "[-1,1,0,-3,3]", "expected": "[0, 0, 9, 0, 0]"}, {"input": "[1,1]", "expected": "[1, 1]"}],
    },
    {
        "id": 6, "title": "Maximum Product Subarray", "slug": "maximum-product-subarray",
        "difficulty": "Medium", "tags": ["Array", "Dynamic Programming"], "acceptance": 34,
        "description": """Given an integer array nums, find a contiguous subarray with the largest product and return the product.

Example 1: Input: nums=[2,3,-2,4]   Output: 6  (subarray [2,3])
Example 2: Input: nums=[-2,0,-1]    Output: 0

Constraints: 1<=nums.length<=2*10^4, -10<=nums[i]<=10""",
        "starter": {
            "python": "def maxProduct(nums):\n    pass\n\nprint(maxProduct([2,3,-2,4]))",
            "javascript": "function maxProduct(nums) {\n}\nconsole.log(maxProduct([2,3,-2,4]));",
            "java": "class Solution {\n    public int maxProduct(int[] nums) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().maxProduct(new int[]{2,3,-2,4})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint maxProduct(vector<int>& n){return 0;}\nint main(){vector<int> n={2,3,-2,4};cout<<maxProduct(n);}",
        },
        "test_cases": [{"input": "[2,3,-2,4]", "expected": "6"}, {"input": "[-2,0,-1]", "expected": "0"}, {"input": "[-2,3,-4]", "expected": "24"}],
    },
    {
        "id": 7, "title": "Find Minimum in Rotated Sorted Array", "slug": "find-minimum-rotated-sorted",
        "difficulty": "Medium", "tags": ["Array", "Binary Search"], "acceptance": 49,
        "description": """Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Find the minimum element.

Example 1: Input: nums=[3,4,5,1,2]   Output: 1
Example 2: Input: nums=[4,5,6,7,0,1,2]  Output: 0

Constraints: n==nums.length, 1<=n<=5000, -5000<=nums[i]<=5000, all values unique""",
        "starter": {
            "python": "def findMin(nums):\n    pass\n\nprint(findMin([3,4,5,1,2]))",
            "javascript": "function findMin(nums) {\n}\nconsole.log(findMin([3,4,5,1,2]));",
            "java": "class Solution {\n    public int findMin(int[] nums) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().findMin(new int[]{3,4,5,1,2})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint findMin(vector<int>& n){return 0;}\nint main(){vector<int> n={3,4,5,1,2};cout<<findMin(n);}",
        },
        "test_cases": [{"input": "[3,4,5,1,2]", "expected": "1"}, {"input": "[4,5,6,7,0,1,2]", "expected": "0"}, {"input": "[11,13,15,17]", "expected": "11"}],
    },
    {
        "id": 8, "title": "Search in Rotated Sorted Array", "slug": "search-rotated-sorted-array",
        "difficulty": "Medium", "tags": ["Array", "Binary Search"], "acceptance": 39,
        "description": """Given a rotated sorted array nums and a target, return the index of target or -1 if not found. Must run in O(log n).

Example 1: Input: nums=[4,5,6,7,0,1,2], target=0  Output: 4
Example 2: Input: nums=[4,5,6,7,0,1,2], target=3  Output: -1

Constraints: 1<=nums.length<=5000, all values unique""",
        "starter": {
            "python": "def search(nums, target):\n    pass\n\nprint(search([4,5,6,7,0,1,2], 0))",
            "javascript": "function search(nums, target) {\n}\nconsole.log(search([4,5,6,7,0,1,2], 0));",
            "java": "class Solution {\n    public int search(int[] nums, int target) { return -1; }\n    public static void main(String[] a) { System.out.println(new Solution().search(new int[]{4,5,6,7,0,1,2},0)); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint search(vector<int>& n,int t){return -1;}\nint main(){vector<int> n={4,5,6,7,0,1,2};cout<<search(n,0);}",
        },
        "test_cases": [{"input": "[4,5,6,7,0,1,2]\n0", "expected": "4"}, {"input": "[4,5,6,7,0,1,2]\n3", "expected": "-1"}, {"input": "[1]\n0", "expected": "-1"}],
    },
    {
        "id": 9, "title": "3Sum", "slug": "3sum",
        "difficulty": "Medium", "tags": ["Array", "Two Pointers", "Sorting"], "acceptance": 32,
        "description": """Given an integer array nums, return all triplets [nums[i], nums[j], nums[k]] such that i!=j!=k and the sum is 0. No duplicate triplets.

Example 1: Input: nums=[-1,0,1,2,-1,-4]  Output: [[-1,-1,2],[-1,0,1]]
Example 2: Input: nums=[0,1,1]            Output: []

Constraints: 3<=nums.length<=3000, -10^5<=nums[i]<=10^5""",
        "starter": {
            "python": "def threeSum(nums):\n    pass\n\nprint(threeSum([-1,0,1,2,-1,-4]))",
            "javascript": "function threeSum(nums) {\n}\nconsole.log(threeSum([-1,0,1,2,-1,-4]));",
            "java": "class Solution {\n    public java.util.List<java.util.List<Integer>> threeSum(int[] nums) { return new java.util.ArrayList<>(); }\n    public static void main(String[] a) { System.out.println(new Solution().threeSum(new int[]{-1,0,1,2,-1,-4})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvector<vector<int>> threeSum(vector<int>& n){return {};}\nint main(){vector<int> n={-1,0,1,2,-1,-4};for(auto& v:threeSum(n)){for(int x:v)cout<<x<<\" \";cout<<endl;}}",
        },
        "test_cases": [{"input": "[-1,0,1,2,-1,-4]", "expected": "[[-1, -1, 2], [-1, 0, 1]]"}, {"input": "[0,1,1]", "expected": "[]"}, {"input": "[0,0,0]", "expected": "[[0, 0, 0]]"}],
    },
    {
        "id": 10, "title": "Container With Most Water", "slug": "container-with-most-water",
        "difficulty": "Medium", "tags": ["Array", "Two Pointers", "Greedy"], "acceptance": 54,
        "description": """Given n integers height[], find two lines that together with the x-axis form a container with the most water.

Example 1: Input: height=[1,8,6,2,5,4,8,3,7]  Output: 49
Example 2: Input: height=[1,1]                  Output: 1

Constraints: n==height.length, 2<=n<=10^5, 0<=height[i]<=10^4""",
        "starter": {
            "python": "def maxArea(height):\n    pass\n\nprint(maxArea([1,8,6,2,5,4,8,3,7]))",
            "javascript": "function maxArea(height) {\n}\nconsole.log(maxArea([1,8,6,2,5,4,8,3,7]));",
            "java": "class Solution {\n    public int maxArea(int[] height) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().maxArea(new int[]{1,8,6,2,5,4,8,3,7})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint maxArea(vector<int>& h){return 0;}\nint main(){vector<int> h={1,8,6,2,5,4,8,3,7};cout<<maxArea(h);}",
        },
        "test_cases": [{"input": "[1,8,6,2,5,4,8,3,7]", "expected": "49"}, {"input": "[1,1]", "expected": "1"}, {"input": "[4,3,2,1,4]", "expected": "16"}],
    },
    {
        "id": 11, "title": "Trapping Rain Water", "slug": "trapping-rain-water",
        "difficulty": "Hard", "tags": ["Array", "Two Pointers", "Stack"], "acceptance": 58,
        "description": """Given n non-negative integers representing elevation heights, compute how much water it can trap after raining.

Example 1: Input: height=[0,1,0,2,1,0,1,3,2,1,2,1]  Output: 6
Example 2: Input: height=[4,2,0,3,2,5]               Output: 9

Constraints: n==height.length, 1<=n<=2*10^4, 0<=height[i]<=10^5""",
        "starter": {
            "python": "def trap(height):\n    pass\n\nprint(trap([0,1,0,2,1,0,1,3,2,1,2,1]))",
            "javascript": "function trap(height) {\n}\nconsole.log(trap([0,1,0,2,1,0,1,3,2,1,2,1]));",
            "java": "class Solution {\n    public int trap(int[] height) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().trap(new int[]{0,1,0,2,1,0,1,3,2,1,2,1})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint trap(vector<int>& h){return 0;}\nint main(){vector<int> h={0,1,0,2,1,0,1,3,2,1,2,1};cout<<trap(h);}",
        },
        "test_cases": [{"input": "[0,1,0,2,1,0,1,3,2,1,2,1]", "expected": "6"}, {"input": "[4,2,0,3,2,5]", "expected": "9"}, {"input": "[1,0,1]", "expected": "1"}],
    },
    {
        "id": 12, "title": "Merge Intervals", "slug": "merge-intervals",
        "difficulty": "Medium", "tags": ["Array", "Sorting"], "acceptance": 46,
        "description": """Given an array of intervals, merge all overlapping intervals and return the non-overlapping intervals.

Example 1: Input: intervals=[[1,3],[2,6],[8,10],[15,18]]  Output: [[1,6],[8,10],[15,18]]
Example 2: Input: intervals=[[1,4],[4,5]]                  Output: [[1,5]]

Constraints: 1<=intervals.length<=10^4, 0<=starti<=endi<=10^4""",
        "starter": {
            "python": "def merge(intervals):\n    pass\n\nprint(merge([[1,3],[2,6],[8,10],[15,18]]))",
            "javascript": "function merge(intervals) {\n}\nconsole.log(merge([[1,3],[2,6],[8,10],[15,18]]));",
            "java": "class Solution {\n    public int[][] merge(int[][] intervals) { return new int[][]{}; }\n    public static void main(String[] a) { System.out.println(java.util.Arrays.deepToString(new Solution().merge(new int[][]{{1,3},{2,6},{8,10},{15,18}}))); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvector<vector<int>> merge(vector<vector<int>>& iv){return {};}\nint main(){vector<vector<int>> iv={{1,3},{2,6},{8,10},{15,18}};for(auto& v:merge(iv))cout<<\"[\"<<v[0]<<\",\"<<v[1]<<\"] \";}",
        },
        "test_cases": [{"input": "[[1,3],[2,6],[8,10],[15,18]]", "expected": "[[1, 6], [8, 10], [15, 18]]"}, {"input": "[[1,4],[4,5]]", "expected": "[[1, 5]]"}, {"input": "[[1,4],[2,3]]", "expected": "[[1, 4]]"}],
    },
    {
        "id": 13, "title": "Insert Interval", "slug": "insert-interval",
        "difficulty": "Medium", "tags": ["Array"], "acceptance": 39,
        "description": """Given non-overlapping sorted intervals and a new interval, insert the new interval (merge if necessary).

Example 1: Input: intervals=[[1,3],[6,9]], newInterval=[2,5]  Output: [[1,5],[6,9]]
Example 2: Input: intervals=[[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval=[4,8]  Output: [[1,2],[3,10],[12,16]]

Constraints: 0<=intervals.length<=10^4""",
        "starter": {
            "python": "def insert(intervals, newInterval):\n    pass\n\nprint(insert([[1,3],[6,9]], [2,5]))",
            "javascript": "function insert(intervals, newInterval) {\n}\nconsole.log(insert([[1,3],[6,9]], [2,5]));",
            "java": "class Solution {\n    public int[][] insert(int[][] intervals, int[] newInterval) { return new int[][]{}; }\n    public static void main(String[] a) { System.out.println(java.util.Arrays.deepToString(new Solution().insert(new int[][]{{1,3},{6,9}},new int[]{2,5}))); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvector<vector<int>> insert(vector<vector<int>>& iv,vector<int>& ni){return {};}\nint main(){vector<vector<int>> iv={{1,3},{6,9}};vector<int> ni={2,5};for(auto& v:insert(iv,ni))cout<<\"[\"<<v[0]<<\",\"<<v[1]<<\"] \";}",
        },
        "test_cases": [{"input": "[[1,3],[6,9]]\n[2,5]", "expected": "[[1, 5], [6, 9]]"}, {"input": "[[1,2],[3,5],[6,7],[8,10],[12,16]]\n[4,8]", "expected": "[[1, 2], [3, 10], [12, 16]]"}, {"input": "[]\n[5,7]", "expected": "[[5, 7]]"}],
    },
    {
        "id": 14, "title": "Sort Colors", "slug": "sort-colors",
        "difficulty": "Medium", "tags": ["Array", "Two Pointers", "Sorting"], "acceptance": 60,
        "description": """Given an array nums with values 0, 1, 2 (Dutch National Flag problem), sort in-place so 0s come first, then 1s, then 2s.

Example 1: Input: nums=[2,0,2,1,1,0]  Output: [0,0,1,1,2,2]
Example 2: Input: nums=[2,0,1]         Output: [0,1,2]

Constraints: 1<=nums.length<=300, nums[i] is 0, 1, or 2""",
        "starter": {
            "python": "def sortColors(nums):\n    pass\n\nnums=[2,0,2,1,1,0]; sortColors(nums); print(nums)",
            "javascript": "function sortColors(nums) {\n}\nlet nums=[2,0,2,1,1,0]; sortColors(nums); console.log(nums);",
            "java": "class Solution {\n    public void sortColors(int[] nums) {}\n    public static void main(String[] a) { int[] n={2,0,2,1,1,0}; new Solution().sortColors(n); System.out.println(java.util.Arrays.toString(n)); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvoid sortColors(vector<int>& n){}\nint main(){vector<int> n={2,0,2,1,1,0};sortColors(n);for(int x:n)cout<<x<<\" \";}",
        },
        "test_cases": [{"input": "[2,0,2,1,1,0]", "expected": "[0, 0, 1, 1, 2, 2]"}, {"input": "[2,0,1]", "expected": "[0, 1, 2]"}, {"input": "[0]", "expected": "[0]"}],
    },
    {
        "id": 15, "title": "Find the Duplicate Number", "slug": "find-duplicate-number",
        "difficulty": "Medium", "tags": ["Array", "Two Pointers", "Bit Manipulation"], "acceptance": 59,
        "description": """Given an array nums of n+1 integers where each integer is in [1,n], find the duplicate number without modifying the array.

Example 1: Input: nums=[1,3,4,2,2]  Output: 2
Example 2: Input: nums=[3,1,3,4,2]  Output: 3

Constraints: 1<=n<=10^5, nums.length==n+1, 1<=nums[i]<=n, only one duplicate""",
        "starter": {
            "python": "def findDuplicate(nums):\n    pass\n\nprint(findDuplicate([1,3,4,2,2]))",
            "javascript": "function findDuplicate(nums) {\n}\nconsole.log(findDuplicate([1,3,4,2,2]));",
            "java": "class Solution {\n    public int findDuplicate(int[] nums) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().findDuplicate(new int[]{1,3,4,2,2})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint findDuplicate(vector<int>& n){return 0;}\nint main(){vector<int> n={1,3,4,2,2};cout<<findDuplicate(n);}",
        },
        "test_cases": [{"input": "[1,3,4,2,2]", "expected": "2"}, {"input": "[3,1,3,4,2]", "expected": "3"}, {"input": "[1,1]", "expected": "1"}],
    },
    {
        "id": 16, "title": "Subarray Sum Equals K", "slug": "subarray-sum-equals-k",
        "difficulty": "Medium", "tags": ["Array", "Hash Table", "Prefix Sum"], "acceptance": 44,
        "description": """Given an integer array nums and an integer k, return the total number of subarrays whose sum equals k.

Example 1: Input: nums=[1,1,1], k=2  Output: 2
Example 2: Input: nums=[1,2,3], k=3  Output: 2

Constraints: 1<=nums.length<=2*10^4, -1000<=nums[i]<=1000, -10^7<=k<=10^7""",
        "starter": {
            "python": "def subarraySum(nums, k):\n    pass\n\nprint(subarraySum([1,1,1], 2))",
            "javascript": "function subarraySum(nums, k) {\n}\nconsole.log(subarraySum([1,1,1], 2));",
            "java": "class Solution {\n    public int subarraySum(int[] nums, int k) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().subarraySum(new int[]{1,1,1},2)); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint subarraySum(vector<int>& n,int k){return 0;}\nint main(){vector<int> n={1,1,1};cout<<subarraySum(n,2);}",
        },
        "test_cases": [{"input": "[1,1,1]\n2", "expected": "2"}, {"input": "[1,2,3]\n3", "expected": "2"}, {"input": "[1]\n0", "expected": "0"}],
    },
    {
        "id": 17, "title": "Rotate Array", "slug": "rotate-array",
        "difficulty": "Medium", "tags": ["Array", "Math", "Two Pointers"], "acceptance": 40,
        "description": """Given an integer array nums, rotate the array to the right by k steps in-place.

Example 1: Input: nums=[1,2,3,4,5,6,7], k=3  Output: [5,6,7,1,2,3,4]
Example 2: Input: nums=[-1,-100,3,99], k=2    Output: [3,99,-1,-100]

Constraints: 1<=nums.length<=10^5, -2^31<=nums[i]<=2^31-1, 0<=k<=10^5""",
        "starter": {
            "python": "def rotate(nums, k):\n    pass\n\nnums=[1,2,3,4,5,6,7]; rotate(nums, 3); print(nums)",
            "javascript": "function rotate(nums, k) {\n}\nlet nums=[1,2,3,4,5,6,7]; rotate(nums, 3); console.log(nums);",
            "java": "class Solution {\n    public void rotate(int[] nums, int k) {}\n    public static void main(String[] a) { int[] n={1,2,3,4,5,6,7}; new Solution().rotate(n,3); System.out.println(java.util.Arrays.toString(n)); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvoid rotate(vector<int>& n,int k){}\nint main(){vector<int> n={1,2,3,4,5,6,7};rotate(n,3);for(int x:n)cout<<x<<\" \";}",
        },
        "test_cases": [{"input": "[1,2,3,4,5,6,7]\n3", "expected": "[5, 6, 7, 1, 2, 3, 4]"}, {"input": "[-1,-100,3,99]\n2", "expected": "[3, 99, -1, -100]"}, {"input": "[1,2]\n3", "expected": "[2, 1]"}],
    },
    {
        "id": 18, "title": "Move Zeroes", "slug": "move-zeroes",
        "difficulty": "Easy", "tags": ["Array", "Two Pointers"], "acceptance": 61,
        "description": """Given an integer array nums, move all 0s to the end while maintaining relative order of non-zero elements. Do it in-place.

Example 1: Input: nums=[0,1,0,3,12]  Output: [1,3,12,0,0]
Example 2: Input: nums=[0]           Output: [0]

Constraints: 1<=nums.length<=10^4, -2^31<=nums[i]<=2^31-1""",
        "starter": {
            "python": "def moveZeroes(nums):\n    pass\n\nnums=[0,1,0,3,12]; moveZeroes(nums); print(nums)",
            "javascript": "function moveZeroes(nums) {\n}\nlet nums=[0,1,0,3,12]; moveZeroes(nums); console.log(nums);",
            "java": "class Solution {\n    public void moveZeroes(int[] nums) {}\n    public static void main(String[] a) { int[] n={0,1,0,3,12}; new Solution().moveZeroes(n); System.out.println(java.util.Arrays.toString(n)); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvoid moveZeroes(vector<int>& n){}\nint main(){vector<int> n={0,1,0,3,12};moveZeroes(n);for(int x:n)cout<<x<<\" \";}",
        },
        "test_cases": [{"input": "[0,1,0,3,12]", "expected": "[1, 3, 12, 0, 0]"}, {"input": "[0]", "expected": "[0]"}, {"input": "[1,0,0,2,3]", "expected": "[1, 2, 3, 0, 0]"}],
    },
    {
        "id": 19, "title": "Plus One", "slug": "plus-one",
        "difficulty": "Easy", "tags": ["Array", "Math"], "acceptance": 43,
        "description": """Given a large integer represented as an integer array digits, increment the integer by one and return the resulting array.

Example 1: Input: digits=[1,2,3]  Output: [1,2,4]
Example 2: Input: digits=[9,9,9]  Output: [1,0,0,0]

Constraints: 1<=digits.length<=100, 0<=digits[i]<=9, no leading zeros""",
        "starter": {
            "python": "def plusOne(digits):\n    pass\n\nprint(plusOne([1,2,3]))",
            "javascript": "function plusOne(digits) {\n}\nconsole.log(plusOne([1,2,3]));",
            "java": "class Solution {\n    public int[] plusOne(int[] digits) { return new int[]{}; }\n    public static void main(String[] a) { System.out.println(java.util.Arrays.toString(new Solution().plusOne(new int[]{1,2,3}))); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvector<int> plusOne(vector<int>& d){return {};}\nint main(){vector<int> d={1,2,3};for(int x:plusOne(d))cout<<x<<\" \";}",
        },
        "test_cases": [{"input": "[1,2,3]", "expected": "[1, 2, 4]"}, {"input": "[9,9,9]", "expected": "[1, 0, 0, 0]"}, {"input": "[4,3,2,1]", "expected": "[4, 3, 2, 2]"}],
    },
    {
        "id": 20, "title": "Spiral Matrix", "slug": "spiral-matrix",
        "difficulty": "Medium", "tags": ["Array", "Matrix", "Simulation"], "acceptance": 46,
        "description": """Given an m×n matrix, return all elements in spiral order.

Example 1: Input: matrix=[[1,2,3],[4,5,6],[7,8,9]]  Output: [1,2,3,6,9,8,7,4,5]
Example 2: Input: matrix=[[1,2],[3,4]]               Output: [1,2,4,3]

Constraints: m==matrix.length, n==matrix[i].length, 1<=m,n<=10""",
        "starter": {
            "python": "def spiralOrder(matrix):\n    pass\n\nprint(spiralOrder([[1,2,3],[4,5,6],[7,8,9]]))",
            "javascript": "function spiralOrder(matrix) {\n}\nconsole.log(spiralOrder([[1,2,3],[4,5,6],[7,8,9]]));",
            "java": "class Solution {\n    public java.util.List<Integer> spiralOrder(int[][] matrix) { return new java.util.ArrayList<>(); }\n    public static void main(String[] a) { System.out.println(new Solution().spiralOrder(new int[][]{{1,2,3},{4,5,6},{7,8,9}})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvector<int> spiralOrder(vector<vector<int>>& m){return {};}\nint main(){vector<vector<int>> m={{1,2,3},{4,5,6},{7,8,9}};for(int x:spiralOrder(m))cout<<x<<\" \";}",
        },
        "test_cases": [{"input": "[[1,2,3],[4,5,6],[7,8,9]]", "expected": "[1, 2, 3, 6, 9, 8, 7, 4, 5]"}, {"input": "[[1,2],[3,4]]", "expected": "[1, 2, 4, 3]"}, {"input": "[[1]]", "expected": "[1]"}],
    },
    {
        "id": 21, "title": "Set Matrix Zeroes", "slug": "set-matrix-zeroes",
        "difficulty": "Medium", "tags": ["Array", "Matrix", "Hash Table"], "acceptance": 52,
        "description": """Given an m×n integer matrix, if an element is 0, set its entire row and column to 0. Do it in-place.

Example 1: Input: matrix=[[1,1,1],[1,0,1],[1,1,1]]  Output: [[1,0,1],[0,0,0],[1,0,1]]
Example 2: Input: matrix=[[0,1,2,0],[3,4,5,2],[1,3,1,5]]  Output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]

Constraints: m==matrix.length, n==matrix[0].length, 1<=m,n<=200""",
        "starter": {
            "python": "def setZeroes(matrix):\n    pass\n\nm=[[1,1,1],[1,0,1],[1,1,1]]; setZeroes(m); print(m)",
            "javascript": "function setZeroes(matrix) {\n}\nlet m=[[1,1,1],[1,0,1],[1,1,1]]; setZeroes(m); console.log(m);",
            "java": "class Solution {\n    public void setZeroes(int[][] matrix) {}\n    public static void main(String[] a) { int[][] m={{1,1,1},{1,0,1},{1,1,1}}; new Solution().setZeroes(m); System.out.println(java.util.Arrays.deepToString(m)); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvoid setZeroes(vector<vector<int>>& m){}\nint main(){vector<vector<int>> m={{1,1,1},{1,0,1},{1,1,1}};setZeroes(m);for(auto& r:m){for(int x:r)cout<<x<<\" \";cout<<endl;}}",
        },
        "test_cases": [{"input": "[[1,1,1],[1,0,1],[1,1,1]]", "expected": "[[1, 0, 1], [0, 0, 0], [1, 0, 1]]"}, {"input": "[[0,1,2,0],[3,4,5,2],[1,3,1,5]]", "expected": "[[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]"}, {"input": "[[1]]", "expected": "[[1]]"}],
    },
    {
        "id": 22, "title": "Rotate Image", "slug": "rotate-image",
        "difficulty": "Medium", "tags": ["Array", "Math", "Matrix"], "acceptance": 72,
        "description": """Given an n×n 2D matrix, rotate the image by 90 degrees clockwise in-place.

Example 1: Input: matrix=[[1,2,3],[4,5,6],[7,8,9]]  Output: [[7,4,1],[8,5,2],[9,6,3]]
Example 2: Input: matrix=[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]  Output: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]

Constraints: n==matrix.length==matrix[i].length, 1<=n<=20""",
        "starter": {
            "python": "def rotate(matrix):\n    pass\n\nm=[[1,2,3],[4,5,6],[7,8,9]]; rotate(m); print(m)",
            "javascript": "function rotate(matrix) {\n}\nlet m=[[1,2,3],[4,5,6],[7,8,9]]; rotate(m); console.log(m);",
            "java": "class Solution {\n    public void rotate(int[][] matrix) {}\n    public static void main(String[] a) { int[][] m={{1,2,3},{4,5,6},{7,8,9}}; new Solution().rotate(m); System.out.println(java.util.Arrays.deepToString(m)); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvoid rotate(vector<vector<int>>& m){}\nint main(){vector<vector<int>> m={{1,2,3},{4,5,6},{7,8,9}};rotate(m);for(auto& r:m){for(int x:r)cout<<x<<\" \";cout<<endl;}}",
        },
        "test_cases": [{"input": "[[1,2,3],[4,5,6],[7,8,9]]", "expected": "[[7, 4, 1], [8, 5, 2], [9, 6, 3]]"}, {"input": "[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]", "expected": "[[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]"}, {"input": "[[1]]", "expected": "[[1]]"}],
    },
    {
        "id": 23, "title": "Jump Game", "slug": "jump-game",
        "difficulty": "Medium", "tags": ["Array", "Greedy", "Dynamic Programming"], "acceptance": 38,
        "description": """Given an integer array nums where each element is your max jump length, return true if you can reach the last index.

Example 1: Input: nums=[2,3,1,1,4]  Output: true
Example 2: Input: nums=[3,2,1,0,4]  Output: false

Constraints: 1<=nums.length<=3*10^4, 0<=nums[i]<=10^5""",
        "starter": {
            "python": "def canJump(nums):\n    pass\n\nprint(canJump([2,3,1,1,4]))",
            "javascript": "function canJump(nums) {\n}\nconsole.log(canJump([2,3,1,1,4]));",
            "java": "class Solution {\n    public boolean canJump(int[] nums) { return false; }\n    public static void main(String[] a) { System.out.println(new Solution().canJump(new int[]{2,3,1,1,4})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nbool canJump(vector<int>& n){return false;}\nint main(){vector<int> n={2,3,1,1,4};cout<<canJump(n);}",
        },
        "test_cases": [{"input": "[2,3,1,1,4]", "expected": "true"}, {"input": "[3,2,1,0,4]", "expected": "false"}, {"input": "[0]", "expected": "true"}],
    },
    {
        "id": 24, "title": "Jump Game II", "slug": "jump-game-ii",
        "difficulty": "Medium", "tags": ["Array", "Greedy", "Dynamic Programming"], "acceptance": 39,
        "description": """Given an array nums, find the minimum number of jumps to reach the last index.

Example 1: Input: nums=[2,3,1,1,4]  Output: 2  (jump to index 1, then to last)
Example 2: Input: nums=[2,3,0,1,4]  Output: 2

Constraints: 1<=nums.length<=10^4, 0<=nums[i]<=1000, guaranteed to reach the end""",
        "starter": {
            "python": "def jump(nums):\n    pass\n\nprint(jump([2,3,1,1,4]))",
            "javascript": "function jump(nums) {\n}\nconsole.log(jump([2,3,1,1,4]));",
            "java": "class Solution {\n    public int jump(int[] nums) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().jump(new int[]{2,3,1,1,4})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint jump(vector<int>& n){return 0;}\nint main(){vector<int> n={2,3,1,1,4};cout<<jump(n);}",
        },
        "test_cases": [{"input": "[2,3,1,1,4]", "expected": "2"}, {"input": "[2,3,0,1,4]", "expected": "2"}, {"input": "[1,2,3]", "expected": "2"}],
    },
    {
        "id": 25, "title": "Majority Element", "slug": "majority-element",
        "difficulty": "Easy", "tags": ["Array", "Hash Table", "Sorting"], "acceptance": 64,
        "description": """Given an array nums of size n, return the majority element (appears more than n/2 times). Always guaranteed to exist.

Example 1: Input: nums=[3,2,3]     Output: 3
Example 2: Input: nums=[2,2,1,1,1,2,2]  Output: 2

Constraints: n==nums.length, 1<=n<=5*10^4, -10^9<=nums[i]<=10^9""",
        "starter": {
            "python": "def majorityElement(nums):\n    pass\n\nprint(majorityElement([3,2,3]))",
            "javascript": "function majorityElement(nums) {\n}\nconsole.log(majorityElement([3,2,3]));",
            "java": "class Solution {\n    public int majorityElement(int[] nums) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().majorityElement(new int[]{3,2,3})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint majorityElement(vector<int>& n){return 0;}\nint main(){vector<int> n={3,2,3};cout<<majorityElement(n);}",
        },
        "test_cases": [{"input": "[3,2,3]", "expected": "3"}, {"input": "[2,2,1,1,1,2,2]", "expected": "2"}, {"input": "[1]", "expected": "1"}],
    },
    {
        "id": 26, "title": "Find All Duplicates in Array", "slug": "find-all-duplicates-array",
        "difficulty": "Medium", "tags": ["Array", "Hash Table"], "acceptance": 73,
        "description": """Given an integer array nums of length n where all integers are in [1,n], return all elements appearing twice.

Example 1: Input: nums=[4,3,2,7,8,2,3,1]  Output: [2,3]
Example 2: Input: nums=[1,1,2]             Output: [1]

Constraints: n==nums.length, 1<=n<=10^5, 1<=nums[i]<=n, each element appears once or twice""",
        "starter": {
            "python": "def findDuplicates(nums):\n    pass\n\nprint(findDuplicates([4,3,2,7,8,2,3,1]))",
            "javascript": "function findDuplicates(nums) {\n}\nconsole.log(findDuplicates([4,3,2,7,8,2,3,1]));",
            "java": "class Solution {\n    public java.util.List<Integer> findDuplicates(int[] nums) { return new java.util.ArrayList<>(); }\n    public static void main(String[] a) { System.out.println(new Solution().findDuplicates(new int[]{4,3,2,7,8,2,3,1})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvector<int> findDuplicates(vector<int>& n){return {};}\nint main(){vector<int> n={4,3,2,7,8,2,3,1};for(int x:findDuplicates(n))cout<<x<<\" \";}",
        },
        "test_cases": [{"input": "[4,3,2,7,8,2,3,1]", "expected": "[2, 3]"}, {"input": "[1,1,2]", "expected": "[1]"}, {"input": "[1]", "expected": "[]"}],
    },
    {
        "id": 27, "title": "Missing Number", "slug": "missing-number",
        "difficulty": "Easy", "tags": ["Array", "Math", "Bit Manipulation"], "acceptance": 62,
        "description": """Given an array nums containing n distinct numbers in range [0,n], return the one number missing.

Example 1: Input: nums=[3,0,1]  Output: 2
Example 2: Input: nums=[0,1]    Output: 2

Constraints: n==nums.length, 1<=n<=10^4, 0<=nums[i]<=n, all distinct""",
        "starter": {
            "python": "def missingNumber(nums):\n    pass\n\nprint(missingNumber([3,0,1]))",
            "javascript": "function missingNumber(nums) {\n}\nconsole.log(missingNumber([3,0,1]));",
            "java": "class Solution {\n    public int missingNumber(int[] nums) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().missingNumber(new int[]{3,0,1})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint missingNumber(vector<int>& n){return 0;}\nint main(){vector<int> n={3,0,1};cout<<missingNumber(n);}",
        },
        "test_cases": [{"input": "[3,0,1]", "expected": "2"}, {"input": "[0,1]", "expected": "2"}, {"input": "[9,6,4,2,3,5,7,0,1]", "expected": "8"}],
    },
    {
        "id": 28, "title": "Find Peak Element", "slug": "find-peak-element",
        "difficulty": "Medium", "tags": ["Array", "Binary Search"], "acceptance": 46,
        "description": """A peak element is greater than its neighbors. Given nums, find a peak element index. O(log n) required.

Example 1: Input: nums=[1,2,3,1]    Output: 2 (nums[2]=3 is a peak)
Example 2: Input: nums=[1,2,1,3,5,6,4]  Output: 5 (nums[5]=6)

Constraints: 1<=nums.length<=1000, -2^31<=nums[i]<=2^31-1, nums[-1]=nums[n]=-inf""",
        "starter": {
            "python": "def findPeakElement(nums):\n    pass\n\nprint(findPeakElement([1,2,3,1]))",
            "javascript": "function findPeakElement(nums) {\n}\nconsole.log(findPeakElement([1,2,3,1]));",
            "java": "class Solution {\n    public int findPeakElement(int[] nums) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().findPeakElement(new int[]{1,2,3,1})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint findPeakElement(vector<int>& n){return 0;}\nint main(){vector<int> n={1,2,3,1};cout<<findPeakElement(n);}",
        },
        "test_cases": [{"input": "[1,2,3,1]", "expected": "2"}, {"input": "[1,2,1,3,5,6,4]", "expected": "5"}, {"input": "[1]", "expected": "0"}],
    },
    {
        "id": 29, "title": "Kth Largest Element in Array", "slug": "kth-largest-element",
        "difficulty": "Medium", "tags": ["Array", "Heap", "Sorting"], "acceptance": 66,
        "description": """Find the kth largest element in an unsorted array. Note that it is the kth largest in sorted order, not distinct.

Example 1: Input: nums=[3,2,1,5,6,4], k=2  Output: 5
Example 2: Input: nums=[3,2,3,1,2,4,5,5,6], k=4  Output: 4

Constraints: 1<=k<=nums.length<=10^5, -10^4<=nums[i]<=10^4""",
        "starter": {
            "python": "def findKthLargest(nums, k):\n    pass\n\nprint(findKthLargest([3,2,1,5,6,4], 2))",
            "javascript": "function findKthLargest(nums, k) {\n}\nconsole.log(findKthLargest([3,2,1,5,6,4], 2));",
            "java": "class Solution {\n    public int findKthLargest(int[] nums, int k) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().findKthLargest(new int[]{3,2,1,5,6,4},2)); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint findKthLargest(vector<int>& n,int k){return 0;}\nint main(){vector<int> n={3,2,1,5,6,4};cout<<findKthLargest(n,2);}",
        },
        "test_cases": [{"input": "[3,2,1,5,6,4]\n2", "expected": "5"}, {"input": "[3,2,3,1,2,4,5,5,6]\n4", "expected": "4"}, {"input": "[1]\n1", "expected": "1"}],
    },
    {
        "id": 30, "title": "Top K Frequent Elements", "slug": "top-k-frequent-elements",
        "difficulty": "Medium", "tags": ["Array", "Hash Table", "Heap"], "acceptance": 64,
        "description": """Given an integer array nums and integer k, return the k most frequent elements.

Example 1: Input: nums=[1,1,1,2,2,3], k=2  Output: [1,2]
Example 2: Input: nums=[1], k=1            Output: [1]

Constraints: 1<=nums.length<=10^5, -10^4<=nums[i]<=10^4, k is in [1, unique count]""",
        "starter": {
            "python": "def topKFrequent(nums, k):\n    pass\n\nprint(topKFrequent([1,1,1,2,2,3], 2))",
            "javascript": "function topKFrequent(nums, k) {\n}\nconsole.log(topKFrequent([1,1,1,2,2,3], 2));",
            "java": "class Solution {\n    public int[] topKFrequent(int[] nums, int k) { return new int[]{}; }\n    public static void main(String[] a) { System.out.println(java.util.Arrays.toString(new Solution().topKFrequent(new int[]{1,1,1,2,2,3},2))); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvector<int> topKFrequent(vector<int>& n,int k){return {};}\nint main(){vector<int> n={1,1,1,2,2,3};for(int x:topKFrequent(n,2))cout<<x<<\" \";}",
        },
        "test_cases": [{"input": "[1,1,1,2,2,3]\n2", "expected": "[1, 2]"}, {"input": "[1]\n1", "expected": "[1]"}, {"input": "[4,1,-1,2,-1,2,3]\n2", "expected": "[-1, 2]"}],
    },
    {
        "id": 31, "title": "Longest Consecutive Sequence", "slug": "longest-consecutive-sequence",
        "difficulty": "Medium", "tags": ["Array", "Hash Table", "Union Find"], "acceptance": 47,
        "description": """Given an unsorted integer array, return the length of the longest consecutive elements sequence. Must run in O(n).

Example 1: Input: nums=[100,4,200,1,3,2]  Output: 4  (sequence: 1,2,3,4)
Example 2: Input: nums=[0,3,7,2,5,8,4,6,0,1]  Output: 9

Constraints: 0<=nums.length<=10^5, -10^9<=nums[i]<=10^9""",
        "starter": {
            "python": "def longestConsecutive(nums):\n    pass\n\nprint(longestConsecutive([100,4,200,1,3,2]))",
            "javascript": "function longestConsecutive(nums) {\n}\nconsole.log(longestConsecutive([100,4,200,1,3,2]));",
            "java": "class Solution {\n    public int longestConsecutive(int[] nums) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().longestConsecutive(new int[]{100,4,200,1,3,2})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint longestConsecutive(vector<int>& n){return 0;}\nint main(){vector<int> n={100,4,200,1,3,2};cout<<longestConsecutive(n);}",
        },
        "test_cases": [{"input": "[100,4,200,1,3,2]", "expected": "4"}, {"input": "[0,3,7,2,5,8,4,6,0,1]", "expected": "9"}, {"input": "[]", "expected": "0"}],
    },
    {
        "id": 32, "title": "Find All Numbers Disappeared in Array", "slug": "find-all-disappeared",
        "difficulty": "Easy", "tags": ["Array", "Hash Table"], "acceptance": 59,
        "description": """Given an array nums of n integers where nums[i] is in [1,n], return a list of integers in [1,n] not in nums.

Example 1: Input: nums=[4,3,2,7,8,2,3,1]  Output: [5,6]
Example 2: Input: nums=[1,1]              Output: [2]

Constraints: n==nums.length, 1<=n<=10^5, 1<=nums[i]<=n""",
        "starter": {
            "python": "def findDisappearedNumbers(nums):\n    pass\n\nprint(findDisappearedNumbers([4,3,2,7,8,2,3,1]))",
            "javascript": "function findDisappearedNumbers(nums) {\n}\nconsole.log(findDisappearedNumbers([4,3,2,7,8,2,3,1]));",
            "java": "class Solution {\n    public java.util.List<Integer> findDisappearedNumbers(int[] nums) { return new java.util.ArrayList<>(); }\n    public static void main(String[] a) { System.out.println(new Solution().findDisappearedNumbers(new int[]{4,3,2,7,8,2,3,1})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvector<int> findDisappearedNumbers(vector<int>& n){return {};}\nint main(){vector<int> n={4,3,2,7,8,2,3,1};for(int x:findDisappearedNumbers(n))cout<<x<<\" \";}",
        },
        "test_cases": [{"input": "[4,3,2,7,8,2,3,1]", "expected": "[5, 6]"}, {"input": "[1,1]", "expected": "[2]"}, {"input": "[2,2]", "expected": "[1]"}],
    },
    {
        "id": 33, "title": "Two Sum II - Input Sorted", "slug": "two-sum-ii-sorted",
        "difficulty": "Medium", "tags": ["Array", "Two Pointers", "Binary Search"], "acceptance": 60,
        "description": """Given a 1-indexed sorted array numbers, find two numbers that sum to target. Return their indices.

Example 1: Input: numbers=[2,7,11,15], target=9  Output: [1,2]
Example 2: Input: numbers=[2,3,4], target=6       Output: [1,3]

Constraints: 2<=numbers.length<=3*10^4, each input has exactly one solution""",
        "starter": {
            "python": "def twoSumSorted(numbers, target):\n    pass\n\nprint(twoSumSorted([2,7,11,15], 9))",
            "javascript": "function twoSumSorted(numbers, target) {\n}\nconsole.log(twoSumSorted([2,7,11,15], 9));",
            "java": "class Solution {\n    public int[] twoSum(int[] numbers, int target) { return new int[]{}; }\n    public static void main(String[] a) { System.out.println(java.util.Arrays.toString(new Solution().twoSum(new int[]{2,7,11,15},9))); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvector<int> twoSum(vector<int>& n,int t){return {};}\nint main(){vector<int> n={2,7,11,15};auto r=twoSum(n,9);cout<<r[0]<<\",\"<<r[1];}",
        },
        "test_cases": [{"input": "[2,7,11,15]\n9", "expected": "[1, 2]"}, {"input": "[2,3,4]\n6", "expected": "[1, 3]"}, {"input": "[-1,0]\n-1", "expected": "[1, 2]"}],
    },
    {
        "id": 34, "title": "4Sum", "slug": "4sum",
        "difficulty": "Medium", "tags": ["Array", "Two Pointers", "Sorting"], "acceptance": 36,
        "description": """Given an array nums and an integer target, return all unique quadruplets [a,b,c,d] such that a+b+c+d==target.

Example 1: Input: nums=[1,0,-1,0,-2,2], target=0  Output: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
Example 2: Input: nums=[2,2,2,2,2], target=8       Output: [[2,2,2,2]]

Constraints: 1<=nums.length<=200, -10^9<=nums[i]<=10^9""",
        "starter": {
            "python": "def fourSum(nums, target):\n    pass\n\nprint(fourSum([1,0,-1,0,-2,2], 0))",
            "javascript": "function fourSum(nums, target) {\n}\nconsole.log(fourSum([1,0,-1,0,-2,2], 0));",
            "java": "class Solution {\n    public java.util.List<java.util.List<Integer>> fourSum(int[] nums, int target) { return new java.util.ArrayList<>(); }\n    public static void main(String[] a) { System.out.println(new Solution().fourSum(new int[]{1,0,-1,0,-2,2},0)); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvector<vector<int>> fourSum(vector<int>& n,int t){return {};}\nint main(){vector<int> n={1,0,-1,0,-2,2};for(auto& v:fourSum(n,0)){for(int x:v)cout<<x<<\" \";cout<<endl;}}",
        },
        "test_cases": [{"input": "[1,0,-1,0,-2,2]\n0", "expected": "[[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]"}, {"input": "[2,2,2,2,2]\n8", "expected": "[[2, 2, 2, 2]]"}, {"input": "[]\n0", "expected": "[]"}],
    },
    {
        "id": 35, "title": "Next Permutation", "slug": "next-permutation",
        "difficulty": "Medium", "tags": ["Array", "Two Pointers"], "acceptance": 37,
        "description": """Find the next lexicographically greater permutation of nums. If impossible, rearrange to smallest (ascending order). Modify in-place.

Example 1: Input: nums=[1,2,3]   Output: [1,3,2]
Example 2: Input: nums=[3,2,1]   Output: [1,2,3]

Constraints: 1<=nums.length<=100, 0<=nums[i]<=100""",
        "starter": {
            "python": "def nextPermutation(nums):\n    pass\n\nnums=[1,2,3]; nextPermutation(nums); print(nums)",
            "javascript": "function nextPermutation(nums) {\n}\nlet nums=[1,2,3]; nextPermutation(nums); console.log(nums);",
            "java": "class Solution {\n    public void nextPermutation(int[] nums) {}\n    public static void main(String[] a) { int[] n={1,2,3}; new Solution().nextPermutation(n); System.out.println(java.util.Arrays.toString(n)); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvoid nextPermutation(vector<int>& n){}\nint main(){vector<int> n={1,2,3};nextPermutation(n);for(int x:n)cout<<x<<\" \";}",
        },
        "test_cases": [{"input": "[1,2,3]", "expected": "[1, 3, 2]"}, {"input": "[3,2,1]", "expected": "[1, 2, 3]"}, {"input": "[1,1,5]", "expected": "[1, 5, 1]"}],
    },
    {
        "id": 36, "title": "Largest Rectangle in Histogram", "slug": "largest-rectangle-histogram",
        "difficulty": "Hard", "tags": ["Array", "Stack", "Monotonic Stack"], "acceptance": 43,
        "description": """Given an array of integers heights representing histogram bar heights, find the area of the largest rectangle.

Example 1: Input: heights=[2,1,5,6,2,3]  Output: 10
Example 2: Input: heights=[2,4]           Output: 4

Constraints: 1<=heights.length<=10^5, 0<=heights[i]<=10^4""",
        "starter": {
            "python": "def largestRectangleArea(heights):\n    pass\n\nprint(largestRectangleArea([2,1,5,6,2,3]))",
            "javascript": "function largestRectangleArea(heights) {\n}\nconsole.log(largestRectangleArea([2,1,5,6,2,3]));",
            "java": "class Solution {\n    public int largestRectangleArea(int[] heights) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().largestRectangleArea(new int[]{2,1,5,6,2,3})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint largestRectangleArea(vector<int>& h){return 0;}\nint main(){vector<int> h={2,1,5,6,2,3};cout<<largestRectangleArea(h);}",
        },
        "test_cases": [{"input": "[2,1,5,6,2,3]", "expected": "10"}, {"input": "[2,4]", "expected": "4"}, {"input": "[1]", "expected": "1"}],
    },
    {
        "id": 37, "title": "Count of Smaller Numbers After Self", "slug": "count-smaller-numbers-after-self",
        "difficulty": "Hard", "tags": ["Array", "Binary Search", "Segment Tree"], "acceptance": 42,
        "description": """Given an integer array nums, return a count array where counts[i] is the count of smaller elements to the right of nums[i].

Example 1: Input: nums=[5,2,6,1]  Output: [2,1,1,0]
Example 2: Input: nums=[-1]        Output: [0]

Constraints: 1<=nums.length<=10^5, -10^4<=nums[i]<=10^4""",
        "starter": {
            "python": "def countSmaller(nums):\n    pass\n\nprint(countSmaller([5,2,6,1]))",
            "javascript": "function countSmaller(nums) {\n}\nconsole.log(countSmaller([5,2,6,1]));",
            "java": "class Solution {\n    public java.util.List<Integer> countSmaller(int[] nums) { return new java.util.ArrayList<>(); }\n    public static void main(String[] a) { System.out.println(new Solution().countSmaller(new int[]{5,2,6,1})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvector<int> countSmaller(vector<int>& n){return {};}\nint main(){vector<int> n={5,2,6,1};for(int x:countSmaller(n))cout<<x<<\" \";}",
        },
        "test_cases": [{"input": "[5,2,6,1]", "expected": "[2, 1, 1, 0]"}, {"input": "[-1]", "expected": "[0]"}, {"input": "[-1,-1]", "expected": "[0, 0]"}],
    },
    {
        "id": 38, "title": "Gas Station", "slug": "gas-station",
        "difficulty": "Medium", "tags": ["Array", "Greedy"], "acceptance": 47,
        "description": """There are n gas stations. gas[i] is the amount of gas and cost[i] is the cost to travel to station i+1. Find the starting station index to complete the circuit, or -1.

Example 1: Input: gas=[1,2,3,4,5], cost=[3,4,5,1,2]  Output: 3
Example 2: Input: gas=[2,3,4], cost=[3,4,3]            Output: -1

Constraints: n==gas.length==cost.length, 1<=n<=10^5""",
        "starter": {
            "python": "def canCompleteCircuit(gas, cost):\n    pass\n\nprint(canCompleteCircuit([1,2,3,4,5],[3,4,5,1,2]))",
            "javascript": "function canCompleteCircuit(gas, cost) {\n}\nconsole.log(canCompleteCircuit([1,2,3,4,5],[3,4,5,1,2]));",
            "java": "class Solution {\n    public int canCompleteCircuit(int[] gas, int[] cost) { return -1; }\n    public static void main(String[] a) { System.out.println(new Solution().canCompleteCircuit(new int[]{1,2,3,4,5},new int[]{3,4,5,1,2})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint canCompleteCircuit(vector<int>& g,vector<int>& c){return -1;}\nint main(){vector<int> g={1,2,3,4,5},c={3,4,5,1,2};cout<<canCompleteCircuit(g,c);}",
        },
        "test_cases": [{"input": "[1,2,3,4,5]\n[3,4,5,1,2]", "expected": "3"}, {"input": "[2,3,4]\n[3,4,3]", "expected": "-1"}, {"input": "[5]\n[4]", "expected": "0"}],
    },
    {
        "id": 39, "title": "Minimum Size Subarray Sum", "slug": "minimum-size-subarray-sum",
        "difficulty": "Medium", "tags": ["Array", "Binary Search", "Sliding Window"], "acceptance": 46,
        "description": """Given an array of positive integers nums and a positive integer target, return the minimal length subarray with sum >= target, or 0 if no such subarray.

Example 1: Input: target=7, nums=[2,3,1,2,4,3]  Output: 2  (subarray [4,3])
Example 2: Input: target=4, nums=[1,4,4]          Output: 1

Constraints: 1<=target<=10^9, 1<=nums.length<=10^5, 1<=nums[i]<=10^5""",
        "starter": {
            "python": "def minSubArrayLen(target, nums):\n    pass\n\nprint(minSubArrayLen(7, [2,3,1,2,4,3]))",
            "javascript": "function minSubArrayLen(target, nums) {\n}\nconsole.log(minSubArrayLen(7, [2,3,1,2,4,3]));",
            "java": "class Solution {\n    public int minSubArrayLen(int target, int[] nums) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().minSubArrayLen(7,new int[]{2,3,1,2,4,3})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint minSubArrayLen(int t,vector<int>& n){return 0;}\nint main(){vector<int> n={2,3,1,2,4,3};cout<<minSubArrayLen(7,n);}",
        },
        "test_cases": [{"input": "7\n[2,3,1,2,4,3]", "expected": "2"}, {"input": "4\n[1,4,4]", "expected": "1"}, {"input": "11\n[1,1,1,1,1,1,1,1]", "expected": "0"}],
    },
    {
        "id": 40, "title": "Pascal's Triangle", "slug": "pascals-triangle",
        "difficulty": "Easy", "tags": ["Array", "Dynamic Programming"], "acceptance": 69,
        "description": """Given an integer numRows, return the first numRows of Pascal's triangle.

Example 1: Input: numRows=5  Output: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
Example 2: Input: numRows=1  Output: [[1]]

Constraints: 1<=numRows<=30""",
        "starter": {
            "python": "def generate(numRows):\n    pass\n\nprint(generate(5))",
            "javascript": "function generate(numRows) {\n}\nconsole.log(generate(5));",
            "java": "class Solution {\n    public java.util.List<java.util.List<Integer>> generate(int numRows) { return new java.util.ArrayList<>(); }\n    public static void main(String[] a) { System.out.println(new Solution().generate(5)); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvector<vector<int>> generate(int n){return {};}\nint main(){for(auto& v:generate(5)){for(int x:v)cout<<x<<\" \";cout<<endl;}}",
        },
        "test_cases": [{"input": "5", "expected": "[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]"}, {"input": "1", "expected": "[[1]]"}, {"input": "3", "expected": "[[1], [1, 1], [1, 2, 1]]"}],
    },
    {
        "id": 41, "title": "Pascal's Triangle II", "slug": "pascals-triangle-ii",
        "difficulty": "Easy", "tags": ["Array", "Dynamic Programming"], "acceptance": 60,
        "description": """Given an integer rowIndex, return the rowIndex-th row of Pascal's triangle. Use O(rowIndex) space.

Example 1: Input: rowIndex=3  Output: [1,3,3,1]
Example 2: Input: rowIndex=0  Output: [1]

Constraints: 0<=rowIndex<=33""",
        "starter": {
            "python": "def getRow(rowIndex):\n    pass\n\nprint(getRow(3))",
            "javascript": "function getRow(rowIndex) {\n}\nconsole.log(getRow(3));",
            "java": "class Solution {\n    public java.util.List<Integer> getRow(int rowIndex) { return new java.util.ArrayList<>(); }\n    public static void main(String[] a) { System.out.println(new Solution().getRow(3)); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvector<int> getRow(int n){return {};}\nint main(){for(int x:getRow(3))cout<<x<<\" \";}",
        },
        "test_cases": [{"input": "3", "expected": "[1, 3, 3, 1]"}, {"input": "0", "expected": "[1]"}, {"input": "1", "expected": "[1, 1]"}],
    },
    {
        "id": 42, "title": "Single Number", "slug": "single-number",
        "difficulty": "Easy", "tags": ["Array", "Bit Manipulation"], "acceptance": 71,
        "description": """Given a non-empty array where every element appears twice except one, find that single one. O(n) time, O(1) space.

Example 1: Input: nums=[2,2,1]         Output: 1
Example 2: Input: nums=[4,1,2,1,2]    Output: 4

Constraints: 1<=nums.length<=3*10^4, each element appears twice except one""",
        "starter": {
            "python": "def singleNumber(nums):\n    pass\n\nprint(singleNumber([2,2,1]))",
            "javascript": "function singleNumber(nums) {\n}\nconsole.log(singleNumber([2,2,1]));",
            "java": "class Solution {\n    public int singleNumber(int[] nums) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().singleNumber(new int[]{2,2,1})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint singleNumber(vector<int>& n){return 0;}\nint main(){vector<int> n={2,2,1};cout<<singleNumber(n);}",
        },
        "test_cases": [{"input": "[2,2,1]", "expected": "1"}, {"input": "[4,1,2,1,2]", "expected": "4"}, {"input": "[1]", "expected": "1"}],
    },
    {
        "id": 43, "title": "First Missing Positive", "slug": "first-missing-positive",
        "difficulty": "Hard", "tags": ["Array", "Hash Table"], "acceptance": 37,
        "description": """Given an unsorted integer array, return the smallest missing positive integer. Must run in O(n) time and O(1) space.

Example 1: Input: nums=[1,2,0]    Output: 3
Example 2: Input: nums=[3,4,-1,1]  Output: 2

Constraints: 1<=nums.length<=5*10^5, -2^31<=nums[i]<=2^31-1""",
        "starter": {
            "python": "def firstMissingPositive(nums):\n    pass\n\nprint(firstMissingPositive([1,2,0]))",
            "javascript": "function firstMissingPositive(nums) {\n}\nconsole.log(firstMissingPositive([1,2,0]));",
            "java": "class Solution {\n    public int firstMissingPositive(int[] nums) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().firstMissingPositive(new int[]{1,2,0})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint firstMissingPositive(vector<int>& n){return 0;}\nint main(){vector<int> n={1,2,0};cout<<firstMissingPositive(n);}",
        },
        "test_cases": [{"input": "[1,2,0]", "expected": "3"}, {"input": "[3,4,-1,1]", "expected": "2"}, {"input": "[7,8,9,11,12]", "expected": "1"}],
    },
    {
        "id": 44, "title": "Median of Two Sorted Arrays", "slug": "median-two-sorted-arrays",
        "difficulty": "Hard", "tags": ["Array", "Binary Search", "Divide and Conquer"], "acceptance": 38,
        "description": """Given two sorted arrays nums1 and nums2 of size m and n, return the median of the two sorted arrays. O(log(m+n)) required.

Example 1: Input: nums1=[1,3], nums2=[2]          Output: 2.0
Example 2: Input: nums1=[1,2], nums2=[3,4]         Output: 2.5

Constraints: 0<=m,n<=1000, -10^6<=nums1[i],nums2[j]<=10^6""",
        "starter": {
            "python": "def findMedianSortedArrays(nums1, nums2):\n    pass\n\nprint(findMedianSortedArrays([1,3],[2]))",
            "javascript": "function findMedianSortedArrays(nums1, nums2) {\n}\nconsole.log(findMedianSortedArrays([1,3],[2]));",
            "java": "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().findMedianSortedArrays(new int[]{1,3},new int[]{2})); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\ndouble findMedianSortedArrays(vector<int>& a,vector<int>& b){return 0;}\nint main(){vector<int> a={1,3},b={2};cout<<findMedianSortedArrays(a,b);}",
        },
        "test_cases": [{"input": "[1,3]\n[2]", "expected": "2.0"}, {"input": "[1,2]\n[3,4]", "expected": "2.5"}, {"input": "[0,0]\n[0,0]", "expected": "0.0"}],
    },
    {
        "id": 45, "title": "Count Inversions in Array", "slug": "count-inversions",
        "difficulty": "Hard", "tags": ["Array", "Sorting", "Merge Sort"], "acceptance": 43,
        "description": """Given an array, count the number of inversions. A pair (i,j) is an inversion if i<j and arr[i]>arr[j].

Example 1: Input: arr=[2,4,1,3,5]  Output: 3  (pairs (2,1),(4,1),(4,3))
Example 2: Input: arr=[5,4,3,2,1]  Output: 10

Constraints: 1<=N<=5*10^4, 1<=arr[i]<=10^5""",
        "starter": {
            "python": "def countInversions(arr):\n    pass\n\nprint(countInversions([2,4,1,3,5]))",
            "javascript": "function countInversions(arr) {\n}\nconsole.log(countInversions([2,4,1,3,5]));",
            "java": "class Solution {\n    public long countInversions(long[] arr, int n) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().countInversions(new long[]{2,4,1,3,5},5)); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nlong countInversions(vector<long>& a){return 0;}\nint main(){vector<long> a={2,4,1,3,5};cout<<countInversions(a);}",
        },
        "test_cases": [{"input": "[2,4,1,3,5]", "expected": "3"}, {"input": "[5,4,3,2,1]", "expected": "10"}, {"input": "[1,2,3,4,5]", "expected": "0"}],
    },
    {
        "id": 46, "title": "Find Median in Data Stream", "slug": "find-median-data-stream",
        "difficulty": "Hard", "tags": ["Array", "Heap", "Design"], "acceptance": 51,
        "description": """Design a data structure that supports: addNum(num) adds an integer, findMedian() returns the median. Implement MedianFinder.

Example: MedianFinder mf; mf.addNum(1); mf.addNum(2); mf.findMedian() -> 1.5; mf.addNum(3); mf.findMedian() -> 2.0

Constraints: -10^5<=num<=10^5, at most 5*10^4 calls to addNum and findMedian""",
        "starter": {
            "python": "class MedianFinder:\n    def __init__(self): pass\n    def addNum(self, num): pass\n    def findMedian(self): pass\n\nmf=MedianFinder(); mf.addNum(1); mf.addNum(2); print(mf.findMedian())",
            "javascript": "class MedianFinder {\n    constructor() {}\n    addNum(num) {}\n    findMedian() {}\n}\nconst mf=new MedianFinder(); mf.addNum(1); mf.addNum(2); console.log(mf.findMedian());",
            "java": "class MedianFinder {\n    public MedianFinder() {}\n    public void addNum(int num) {}\n    public double findMedian() { return 0; }\n    public static void main(String[] a) { MedianFinder mf=new MedianFinder(); mf.addNum(1); mf.addNum(2); System.out.println(mf.findMedian()); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nclass MedianFinder{\npublic:\n    void addNum(int n){}\n    double findMedian(){return 0;}\n};\nint main(){MedianFinder mf;mf.addNum(1);mf.addNum(2);cout<<mf.findMedian();}",
        },
        "test_cases": [{"input": "addNum(1)\naddNum(2)\nfindMedian()", "expected": "1.5"}, {"input": "addNum(1)\nfindMedian()", "expected": "1.0"}, {"input": "addNum(1)\naddNum(2)\naddNum(3)\nfindMedian()", "expected": "2.0"}],
    },
    {
        "id": 47, "title": "Chocolate Distribution Problem", "slug": "chocolate-distribution",
        "difficulty": "Easy", "tags": ["Array", "Sorting", "Greedy"], "acceptance": 55,
        "description": """Given an array of n packets with chocolates, distribute m packets to m students to minimize the difference between maximum and minimum chocolates.

Example 1: Input: arr=[3,4,1,9,56,7,9,12], m=5  Output: 6  (distribute [3,4,7,9,9])
Example 2: Input: arr=[7,3,2,4,9,12,56], m=3    Output: 2

Constraints: 1<=m<=n<=10^5, 1<=arr[i]<=10^9""",
        "starter": {
            "python": "def minDiff(arr, m):\n    pass\n\nprint(minDiff([3,4,1,9,56,7,9,12], 5))",
            "javascript": "function minDiff(arr, m) {\n}\nconsole.log(minDiff([3,4,1,9,56,7,9,12], 5));",
            "java": "class Solution {\n    public long findMinDiff(long[] a, long n, long m) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().findMinDiff(new long[]{3,4,1,9,56,7,9,12},8,5)); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nlong minDiff(vector<long>& a,int m){return 0;}\nint main(){vector<long> a={3,4,1,9,56,7,9,12};cout<<minDiff(a,5);}",
        },
        "test_cases": [{"input": "[3,4,1,9,56,7,9,12]\n5", "expected": "6"}, {"input": "[7,3,2,4,9,12,56]\n3", "expected": "2"}, {"input": "[1,2,3,4,5]\n3", "expected": "2"}],
    },
    {
        "id": 48, "title": "Rearrange Array Alternating", "slug": "rearrange-array-alternating",
        "difficulty": "Medium", "tags": ["Array", "Sorting"], "acceptance": 51,
        "description": """Given an array of positive and negative numbers, rearrange so positives and negatives alternate. Start with positive.

Example 1: Input: arr=[1,2,3,-4,-1,-2]  Output: [1,-4,2,-1,3,-2]
Example 2: Input: arr=[-5,3,4,5,-6,-1,-2,-3]  Output: [3,-5,4,-6,5,-1,-2,-3]

Constraints: 1<=n<=10^7, -10^6<=arr[i]<=10^6""",
        "starter": {
            "python": "def rearrange(arr):\n    pass\n\nprint(rearrange([1,2,3,-4,-1,-2]))",
            "javascript": "function rearrange(arr) {\n}\nconsole.log(rearrange([1,2,3,-4,-1,-2]));",
            "java": "class Solution {\n    public void rearrange(int[] arr, int n) {}\n    public static void main(String[] a) { int[] arr={1,2,3,-4,-1,-2}; new Solution().rearrange(arr,6); System.out.println(java.util.Arrays.toString(arr)); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvoid rearrange(vector<int>& a){}\nint main(){vector<int> a={1,2,3,-4,-1,-2};rearrange(a);for(int x:a)cout<<x<<\" \";}",
        },
        "test_cases": [{"input": "[1,2,3,-4,-1,-2]", "expected": "[1, -4, 2, -1, 3, -2]"}, {"input": "[-5,3,4,5,-6,-1]", "expected": "[3, -5, 4, -6, 5, -1]"}, {"input": "[1,-1]", "expected": "[1, -1]"}],
    },
    {
        "id": 49, "title": "Maximum Sum of Non-Adjacent Elements", "slug": "max-sum-non-adjacent",
        "difficulty": "Medium", "tags": ["Array", "Dynamic Programming"], "acceptance": 52,
        "description": """Given an array of positive integers, find the maximum sum of a subsequence with no two adjacent elements.

Example 1: Input: arr=[5,5,10,100,10,5]  Output: 110
Example 2: Input: arr=[1,2,3]            Output: 4

Constraints: 1<=N<=10^5, 1<=arr[i]<=10^6""",
        "starter": {
            "python": "def findMaxSum(arr):\n    pass\n\nprint(findMaxSum([5,5,10,100,10,5]))",
            "javascript": "function findMaxSum(arr) {\n}\nconsole.log(findMaxSum([5,5,10,100,10,5]));",
            "java": "class Solution {\n    public int findMaxSum(int[] arr, int n) { return 0; }\n    public static void main(String[] a) { System.out.println(new Solution().findMaxSum(new int[]{5,5,10,100,10,5},6)); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nint findMaxSum(vector<int>& a){return 0;}\nint main(){vector<int> a={5,5,10,100,10,5};cout<<findMaxSum(a);}",
        },
        "test_cases": [{"input": "[5,5,10,100,10,5]", "expected": "110"}, {"input": "[1,2,3]", "expected": "4"}, {"input": "[5,1,1,5]", "expected": "10"}],
    },
    {
        "id": 50, "title": "Sliding Window Maximum", "slug": "sliding-window-maximum",
        "difficulty": "Hard", "tags": ["Array", "Queue", "Sliding Window", "Deque"], "acceptance": 46,
        "description": """Given an array nums and sliding window of size k, return an array of max values in each window.

Example 1: Input: nums=[1,3,-1,-3,5,3,6,7], k=3  Output: [3,3,5,5,6,7]
Example 2: Input: nums=[1], k=1                    Output: [1]

Constraints: 1<=nums.length<=10^5, -10^4<=nums[i]<=10^4, 1<=k<=nums.length""",
        "starter": {
            "python": "def maxSlidingWindow(nums, k):\n    pass\n\nprint(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3))",
            "javascript": "function maxSlidingWindow(nums, k) {\n}\nconsole.log(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3));",
            "java": "class Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) { return new int[]{}; }\n    public static void main(String[] a) { System.out.println(java.util.Arrays.toString(new Solution().maxSlidingWindow(new int[]{1,3,-1,-3,5,3,6,7},3))); }\n}",
            "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nvector<int> maxSlidingWindow(vector<int>& n,int k){return {};}\nint main(){vector<int> n={1,3,-1,-3,5,3,6,7};for(int x:maxSlidingWindow(n,3))cout<<x<<\" \";}",
        },
        "test_cases": [{"input": "[1,3,-1,-3,5,3,6,7]\n3", "expected": "[3, 3, 5, 5, 6, 7]"}, {"input": "[1]\n1", "expected": "[1]"}, {"input": "[1,-1]\n1", "expected": "[1, -1]"}],
    },
]


# ── Helper functions ──────────────────────────────────────────────────────────

def get_all_problems():
    """Return lightweight list (no description/starter/test_cases) for problem listing."""
    return [
        {
            "id": p["id"],
            "title": p["title"],
            "slug": p["slug"],
            "difficulty": p["difficulty"],
            "tags": p["tags"],
            "acceptance": p["acceptance"],
        }
        for p in PROBLEMS
    ]

def get_problem(problem_id: int):
    """Return full problem detail by ID."""
    return next((p for p in PROBLEMS if p["id"] == problem_id), None)
