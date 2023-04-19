import { parsePuzzle, generateGoal, Node, Solver } from "../index.js"

test('solvable - zF - 3 - manhattan - g:f - u:f - PriorityQ', async () => {
    const puzzleTxt = `# Puzzles can be aligned, or NOT. whatever. accept both.
3
0 3 7
5 6 4
1 8 2
`
    const puzzle = parsePuzzle(puzzleTxt);
    const params = {
        goal: "zFirst",
        puzzle: puzzle.puzzle,
        greedy: false, // true == ignore the treeLevel score
        uniform: false, // true == ignore the heuristic score
        heuristic: ["manhattan"], // the list of heuristics to use
        queueType: "priorityQ"  // "heapQ" or "priorityQ"
    }
    // generated the tar/get puzzle need to be reach (˜the goal puzzle)
    const goal = generateGoal[params.goal](params.puzzle.length);
    // generate new node of the this puzzle which will be the first puzzle in the solver
    const initPuzzle = new Node(params.puzzle, params.greedy, params.uniform, goal, undefined, params.heuristic);
    // display puzzle to terminal


    // init a solver instant and start the process
    const solver = new Solver(params.queueType);
    let solution = await solver.start_ASTAR(+Infinity, initPuzzle);
    // console.log(solution.steps.map(l => l[3]).filter(l => l).join(""))
    expect(solution.steps.length).toBe(23);
    expect(solution).toMatchObject({
        cTime: 533,
        cSize: 321
    })
});
test('solvable - zF - 3 - manhattan - g:f - u:f - HeapQ', async () => {
    const puzzleTxt = `# Puzzles can be aligned, or NOT. whatever. accept both.
3
0 3 7
5 6 4
1 8 2
`
    const puzzle = parsePuzzle(puzzleTxt);
    const params = {
        goal: "zFirst",
        puzzle: puzzle.puzzle,
        greedy: false, // true == ignore the treeLevel score
        uniform: false, // true == ignore the heuristic score
        heuristic: ["manhattan"], // the list of heuristics to use
        queueType: "heapQ"  // "heapQ" or "priorityQ"
    }
    // generated the tar/get puzzle need to be reach (˜the goal puzzle)
    const goal = generateGoal[params.goal](params.puzzle.length);
    // generate new node of the this puzzle which will be the first puzzle in the solver
    const initPuzzle = new Node(params.puzzle, params.greedy, params.uniform, goal, undefined, params.heuristic);
    // display puzzle to terminal


    // init a solver instant and start the process
    const solver = new Solver(params.queueType);
    let solution = await solver.start_ASTAR(+Infinity, initPuzzle);
    // console.log(solution.steps.map(l => l[3]).filter(l => l).join(""))
    expect(solution.steps.length).toBe(23);
    expect(solution).toMatchObject({
        cTime: 800,
        cSize: 513
    })
});

test('solvable - zF - 3 - manhattan - g:t - u:f - priorityQ', async () => {
    const puzzleTxt = `# Puzzles can be aligned, or NOT. whatever. accept both.
3
0 3 7
5 6 4
1 8 2
`
    const puzzle = parsePuzzle(puzzleTxt);
    const params = {
        goal: "zFirst",
        puzzle: puzzle.puzzle,
        greedy: true, // true == ignore the treeLevel score
        uniform: false, // true == ignore the heuristic score
        heuristic: ["manhattan"], // the list of heuristics to use
        queueType: "priorityQ"  // "heapQ" or "priorityQ"
    }
    // generated the tar/get puzzle need to be reach (˜the goal puzzle)
    const goal = generateGoal[params.goal](params.puzzle.length);
    // generate new node of the this puzzle which will be the first puzzle in the solver
    const initPuzzle = new Node(params.puzzle, params.greedy, params.uniform, goal, undefined, params.heuristic);
    // display puzzle to terminal


    // init a solver instant and start the process
    const solver = new Solver(params.queueType);
    let solution = await solver.start_ASTAR(+Infinity, initPuzzle);
    // console.log(solution.steps.map(l => l[3]).filter(l => l).join(""))
    expect(solution.steps.length).toBe(59);
    expect(solution).toMatchObject({
        cTime: 601,
        cSize: 391
    })
});

test('solvable - zF - 3 - g:f - u:t - priorityQ - slow', async () => {
    const puzzleTxt = `# Puzzles can be aligned, or NOT. whatever. accept both.
3
0 3 7
5 6 4
1 8 2
`
    const puzzle = parsePuzzle(puzzleTxt);
    const params = {
        goal: "zFirst",
        puzzle: puzzle.puzzle,
        greedy: false, // true == ignore the treeLevel score
        uniform: true, // true == ignore the heuristic score
        heuristic: [], // the list of heuristics to use
        queueType: "priorityQ"  // "heapQ" or "priorityQ"
    }
    // generated the tar/get puzzle need to be reach (˜the goal puzzle)
    const goal = generateGoal[params.goal](params.puzzle.length);
    // generate new node of the this puzzle which will be the first puzzle in the solver
    const initPuzzle = new Node(params.puzzle, params.greedy, params.uniform, goal, undefined, params.heuristic);
    // display puzzle to terminal


    // init a solver instant and start the process
    const solver = new Solver(params.queueType);
    let solution = await solver.start_ASTAR(+Infinity, initPuzzle);
    // console.log(solution.steps.map(l => l[3]).filter(l => l).join(""))
    expect(solution.steps.length).toBe(23);
    expect(solution).toMatchObject({
        cTime: 76817,
        cSize: 23959
    })
});