
import { useEffect, useState } from "react";

const COURSES = [
  {
    id: "os", code: "CSCI 340", name: "Operating Systems", category: "Computer Science",
    cards: [
      ["What is an operating system?", "Software that manages hardware and provides services to applications."],
      ["What is a process?", "A program that is currently executing."],
      ["What is a thread?", "A unit of execution within a process."],
      ["What is a context switch?", "Saving one process's state and loading another's."],
      ["What is deadlock?", "Processes waiting indefinitely for resources held by each other."],
      ["What is virtual memory?", "A system that maps virtual addresses to physical memory."],
      ["What is a race condition?", "When results depend on the timing of concurrent operations."],
      ["What is a semaphore?", "A synchronization tool for controlling access to shared resources."],
      ["What is a system call?", "A request from an application for a kernel service."],
      ["What is round-robin scheduling?", "Giving each ready process a time slice in rotation."]
    ]
  },
  {
    id: "discrete", code: "CSCI 150", name: "Discrete Structures", category: "Mathematics",
    cards: [
      ["What is a proposition?", "A statement that is either true or false."],
      ["What is a tautology?", "A statement true under every truth assignment."],
      ["What does ∀ mean?", "For all elements in the domain."],
      ["What does ∃ mean?", "There exists at least one element."],
      ["When is P → Q false?", "When P is true and Q is false."],
      ["What is a bijection?", "A function that is both one-to-one and onto."],
      ["What is a power set?", "The set of all subsets of a set."],
      ["What is mathematical induction?", "Proving a base case and an inductive step."],
      ["What is a graph?", "A collection of vertices and edges."],
      ["What is De Morgan's law for NOT(P AND Q)?", "NOT P OR NOT Q."]
    ]
  },
  {
    id: "architecture", code: "CSCI 260", name: "Computer Architecture II", category: "Computer Science",
    cards: [
      ["What is an ISA?", "The instruction set interface between software and hardware."],
      ["What is pipelining?", "Overlapping instruction stages to improve throughput."],
      ["What is a cache?", "Small, fast memory storing frequently accessed data."],
      ["What is a CPU register?", "A small, fast storage location inside the processor."],
      ["What is a data hazard?", "An instruction dependency that affects pipeline execution."],
      ["What is branch prediction?", "Predicting a branch outcome before it resolves."],
      ["What is RISC?", "Reduced Instruction Set Computer."],
      ["What is an ALU?", "The arithmetic logic unit."],
      ["What is a cache miss?", "When requested data is not found in the cache."],
      ["What is instruction latency?", "The time required to complete an instruction."]
    ]
  },
  {
    id: "structures", code: "CSCI 235", name: "Software Analysis and Design II", category: "Computer Science",
    cards: [
      ["What is an array?", "A collection of indexed elements."],
      ["What is a linked list?", "Nodes connected through references or pointers."],
      ["What is a stack?", "A last-in, first-out data structure."],
      ["What is a queue?", "A first-in, first-out data structure."],
      ["What is a binary tree?", "A tree where each node has at most two children."],
      ["What is a hash table?", "A structure mapping keys to values using hashing."],
      ["What is recursion?", "A function calling itself to solve smaller subproblems."],
      ["What is Big O notation?", "A description of asymptotic resource growth."],
      ["What is binary search?", "Searching sorted data by repeatedly halving the search range."],
      ["What is a heap?", "A tree-based structure satisfying a heap-order property."]
    ]
  },
  {
    id: "logic", code: "CSCI 275", name: "Symbolic Logic", category: "Mathematics",
    cards: [
      ["What is a valid argument?", "True premises cannot lead to a false conclusion."],
      ["What is a sound argument?", "A valid argument with true premises."],
      ["What does ∧ mean?", "Logical AND."],
      ["What does ∨ mean?", "Logical OR, inclusive."],
      ["What does ¬ mean?", "Logical NOT."],
      ["What does → mean?", "Material implication."],
      ["What does ↔ mean?", "Biconditional: both statements have the same truth value."],
      ["What is a contradiction?", "A statement false under every truth assignment."],
      ["What is modus ponens?", "From P and P → Q, conclude Q."],
      ["What is modus tollens?", "From P → Q and ¬Q, conclude ¬P."]
    ]
  },
  {
    id: "database", code: "DATABASES", name: "Database Systems", category: "Computer Science",
    cards: [
      ["What is a database?", "An organized collection of data."],
      ["What is SQL?", "Structured Query Language."],
      ["What is a primary key?", "A column or combination of columns uniquely identifying a row."],
      ["What is a foreign key?", "A field referencing a key in another table."],
      ["What does SELECT do?", "Retrieves data from a database."],
      ["What does INSERT do?", "Adds new rows to a table."],
      ["What does UPDATE do?", "Modifies existing rows."],
      ["What does DELETE do?", "Removes rows."],
      ["What is normalization?", "Organizing relational data to reduce redundancy and anomalies."],
      ["What is a JOIN?", "Combining related rows from tables."]
    ]
  },
  {
    id: "intro", code: "CSCI 127", name: "Introduction to Computer Science", category: "Computer Science",
    cards: [
      ["What is an algorithm?", "A sequence of steps used to solve a problem."],
      ["What is a variable?", "A name that refers to a stored value."],
      ["What is a loop?", "A structure that repeats instructions."],
      ["What is a conditional?", "A statement that chooses what code runs based on a condition."],
      ["What is a function?", "A reusable block of code that performs a task."],
      ["What is a Boolean?", "A value that is either true or false."],
      ["What is a list?", "An ordered collection of values."],
      ["What is debugging?", "Finding and fixing problems in code."]
    ]
  },
  {
    id: "cs135", code: "CSCI 135", name: "Software Analysis and Design I", category: "Computer Science",
    cards: [
      ["What is a compiler?", "A program that translates source code into another form, often machine code."],
      ["What is a parameter?", "A variable that receives input in a function."],
      ["What is a return value?", "The result a function sends back to its caller."],
      ["What is an array?", "A collection of elements accessed using indexes."],
      ["What is a pointer in C++?", "A variable that stores a memory address."],
      ["What is a reference in C++?", "An alternative name for an existing object."],
      ["What is a class?", "A definition that groups data and related functions."],
      ["What is encapsulation?", "Keeping related data and behavior together while controlling access."]
    ]
  },
  {
    id: "cs160", code: "CSCI 160", name: "Computer Architecture I", category: "Computer Science",
    cards: [
      ["What is binary?", "A number system that uses only 0 and 1."],
      ["What is a bit?", "A single binary digit."],
      ["What is a byte?", "A group of eight bits."],
      ["What is a logic gate?", "A circuit that performs a Boolean operation."],
      ["What does an AND gate do?", "Outputs 1 only when all its inputs are 1."],
      ["What does an OR gate do?", "Outputs 1 when at least one input is 1."],
      ["What is a flip-flop?", "A circuit that can store one bit of information."],
      ["What is an instruction cycle?", "The steps a CPU takes to fetch, decode, and execute an instruction."]
    ]
  },
  {
    id: "cs265", code: "CSCI 265", name: "Computer Theory I", category: "Computer Science",
    cards: [
      ["What is a finite automaton?", "A mathematical model with a finite number of states."],
      ["What is a DFA?", "A deterministic finite automaton."],
      ["What is an NFA?", "A nondeterministic finite automaton."],
      ["What is an alphabet in automata theory?", "A finite set of symbols."],
      ["What is a string?", "A finite sequence of symbols from an alphabet."],
      ["What is a regular language?", "A language recognized by a finite automaton."],
      ["What is a regular expression?", "A notation used to describe regular languages."],
      ["What is an accepting state?", "A state indicating that an input string is accepted."]
    ]
  },
  {
    id: "cs335", code: "CSCI 335", name: "Software Analysis and Design III", category: "Computer Science",
    cards: [
      ["What is algorithm complexity?", "A measure of how an algorithm's resource use grows with input size."],
      ["What does O(n) mean?", "An asymptotic upper bound that grows linearly with input size."],
      ["What is divide and conquer?", "Solving a problem by breaking it into smaller subproblems."],
      ["What is merge sort?", "A sorting algorithm that divides and merges sorted portions."],
      ["What is a greedy algorithm?", "An algorithm that makes a locally optimal choice at each step."],
      ["What is dynamic programming?", "Solving overlapping subproblems and storing their results."],
      ["What is a graph traversal?", "A method for visiting vertices in a graph."],
      ["What is Dijkstra's algorithm?", "An algorithm for shortest paths with nonnegative edge weights."]
    ]
  },
  {
    id: "image", code: "CSCI 39534", name: "Digital Image Processing", category: "Computer Science",
    cards: [
      ["What is a pixel?", "The smallest addressable element of a digital image."],
      ["What is image resolution?", "The number of pixels in an image's dimensions."],
      ["What is a grayscale image?", "An image represented using intensity values."],
      ["What is a histogram?", "A count of how often different pixel intensities occur."],
      ["What is image filtering?", "Applying an operation to change or analyze pixel values."],
      ["What is a convolution kernel?", "A small matrix used to calculate filtered pixel values."],
      ["What is edge detection?", "Identifying areas where image intensity changes sharply."],
      ["What is image segmentation?", "Dividing an image into meaningful regions."]
    ]
  },
  {
    id: "web", code: "CSCI 39548", name: "Practical Web Development", category: "Computer Science",
    cards: [
      ["What does HTML do?", "Defines the structure and content of a webpage."],
      ["What does CSS do?", "Controls the presentation and layout of a webpage."],
      ["What does JavaScript do?", "Adds behavior and interactivity to webpages."],
      ["What is the DOM?", "A tree representation of a document that code can interact with."],
      ["What is an event listener?", "Code that responds when a specified event occurs."],
      ["What is responsive design?", "Designing layouts that adapt to different screen sizes."],
      ["What is a CSS class?", "A reusable selector used to apply styles to elements."],
      ["What is localStorage?", "Browser storage that can persist key-value data between visits."]
    ]
  },
  {
    id: "matrix", code: "MATH 160", name: "Matrix Algebra", category: "Mathematics",
    cards: [
      ["What is a matrix?", "A rectangular arrangement of numbers or other elements."],
      ["What is a vector?", "An ordered collection of values."],
      ["What is matrix multiplication?", "Combining matrices using row-by-column dot products."],
      ["What is the identity matrix?", "A square matrix with ones on the diagonal and zeros elsewhere."],
      ["What is a determinant?", "A scalar associated with a square matrix."],
      ["What is an inverse matrix?", "A matrix that multiplies with the original to give the identity matrix."],
      ["What is a transpose?", "A matrix formed by switching rows and columns."],
      ["What is a linear transformation?", "A function that preserves vector addition and scalar multiplication."]
    ]
  },
  {
    id: "stats", code: "STAT 213", name: "Introduction to Applied Statistics", category: "Mathematics",
    cards: [
      ["What is the mean?", "The sum of values divided by the number of values."],
      ["What is the median?", "The middle value after sorting the data."],
      ["What is the mode?", "The most frequently occurring value."],
      ["What is standard deviation?", "A measure of how spread out values are around the mean."],
      ["What is probability?", "A measure of how likely an event is."],
      ["What is a sample?", "A subset of a population used for analysis."],
      ["What is a confidence interval?", "An interval calculated by a method with a stated long-run coverage rate."],
      ["What is correlation?", "A measure of the direction and strength of association between variables."]
    ]
  },
  {
    id: "calc2", code: "MATH 155", name: "Calculus II", category: "Mathematics",
    cards: [
      ["What is integration?", "Finding an antiderivative or calculating accumulated change."],
      ["What is a definite integral?", "An integral evaluated between specified limits."],
      ["What is integration by parts?", "A technique based on the product rule for derivatives."],
      ["What is a sequence?", "An ordered list of numbers."],
      ["What is a series?", "A sum of terms from a sequence."],
      ["What does convergence mean?", "Approaching a finite limit."],
      ["What is a Taylor series?", "A power series built from a function's derivatives at a point."],
      ["What is an improper integral?", "An integral with an infinite limit or an unbounded integrand."]
    ]
  },
  {
    id: "pol204", code: "POLSC 20462", name: "Modern Islamic Political Thought", category: "Political Science",
    cards: [
      ["What is political thought?", "The study of ideas about authority, government, and political life."],
      ["What is sovereignty?", "Supreme authority within a political system."],
      ["What is political legitimacy?", "The accepted right of an authority to govern."],
      ["What is reformism?", "An approach that seeks change through reforms rather than complete replacement."],
      ["What is a caliphate?", "A historical institution of Muslim political leadership."],
      ["What is constitutionalism?", "The principle that government authority should be limited by constitutional rules."],
      ["What is secularism?", "An approach to the relationship between religion and state institutions."],
      ["What is political pluralism?", "The recognition of multiple groups and perspectives in political life."]
    ]
  },
  {
    id: "pol213", code: "POLSC 213", name: "Political Parties and Elections", category: "Political Science",
    cards: [
      ["What is a political party?", "An organization that seeks political influence, often through elections."],
      ["What is an electoral system?", "The rules used to turn votes into election outcomes."],
      ["What is proportional representation?", "An electoral system that allocates seats roughly in proportion to votes."],
      ["What is a primary election?", "An election used to select candidates for a later election."],
      ["What is voter turnout?", "The share of eligible or registered voters who participate in an election."],
      ["What is incumbency?", "The condition of currently holding an elected office."],
      ["What is a coalition government?", "A government formed by multiple political parties."],
      ["What is political polarization?", "Increasing division between political groups or viewpoints."]
    ]
  },
  {
    id: "pol271", code: "POLSC 271", name: "International Politics of the Americas", category: "Political Science",
    cards: [
      ["What are international relations?", "The study of interactions among states and other international actors."],
      ["What is diplomacy?", "Managing relationships through communication and negotiation."],
      ["What is foreign policy?", "A government's approach to relations with other countries."],
      ["What is regional integration?", "Countries coordinating or combining policies and institutions within a region."],
      ["What is the OAS?", "The Organization of American States."],
      ["What is sovereignty?", "A state's authority over its territory and domestic affairs."],
      ["What is a trade agreement?", "An agreement setting rules for trade between parties."],
      ["What is multilateralism?", "Cooperation among three or more countries."]
    ]
  },
  {
    id: "pol283", code: "POLSC 283", name: "Terrorism", category: "Political Science",
    cards: [
      ["What is terrorism?", "A contested term generally referring to violence or threats intended to intimidate or influence a wider audience for political purposes."],
      ["What is radicalization?", "A process through which someone adopts increasingly extreme beliefs, sometimes including support for violence."],
      ["What is counterterrorism?", "Policies and actions intended to prevent or respond to terrorism."],
      ["What is an insurgency?", "An organized challenge to an established authority, often involving armed conflict."],
      ["What is political violence?", "Violence used for political purposes."],
      ["What is propaganda?", "Communication intended to influence attitudes or behavior."],
      ["What is asymmetric conflict?", "Conflict between opponents with substantially different capabilities."],
      ["What is international cooperation?", "Countries working together to address shared problems."]
    ]
  }
];

const STORE = "peerconnect-study-v1";
const QUIZ_STORE = "peerconnect-quiz-history-v1";
const EXTRA_STORE = "peerconnect-extra-v1";

function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value && typeof value === "object" ? value : fallback;
  } catch {
    return fallback;
  }
}

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function makeQuiz(cards, limit) {
  return shuffle(cards).slice(0, limit).map(([question, answer]) => {
    const wrong = [...new Set(cards.map(card => card[1]).filter(a => a !== answer))];
    return {
      question,
      answer,
      options: shuffle([answer, ...shuffle(wrong).slice(0, 3)])
    };
  });
}

const todayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

function daysUntil(date) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(`${date}T00:00:00`);
  return Math.round((target - start) / 86400000);
}

const CSS = `
<CodeBlock language="css" editable>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=DM+Serif+Display&display=swap');


:root {
  font-family: 'DM Sans', sans-serif !important;
  color: #20382f !important;
  background: #f0eee7 !important;
}

* {
box-sizing: border-box;
}

body {
  margin: 0 !important;
  background: #f0eee7 !important;
  color: #20382f !important;
}

button, input, textarea, select {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  opacity: .4;
  cursor: not-allowed;
}

h1, h2, h3, p {
  margin-top: 0;
}

.pc-app {
  display: flex;
  min-height: 100vh;
}

.pc-sidebar {
  width: 245px;
  background: #203a34;
  color: #f5eee0;
  padding: 32px 17px;
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.pc-logo {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 28px;
  margin: 5px 8px 58px;
  letter-spacing: -1px;
}

.pc-logo span {
  color: #d4ac6e;
}

.pc-side-label, .pc-kicker, .pc-code, .pc-small {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: .7px;
}

.pc-side-label {
  color: #c3d3c4;
  margin: 0 12px 18px;
}

.pc-nav {
  display: grid;
  gap: 5px;
}

.pc-nav button {
  background: transparent;
  color: #e0e9de;
  border: 0;
  text-align: left;
  padding: 14px;
  border-radius: 6px;
  display: flex;
  gap: 15px;
  align-items: center;
  font-size: 15px;
  transition: transform .2s ease, background .2s ease;
}

.pc-nav button:hover,
.pc-nav button.active {
  background: #365d4a;
  color: white;
}

.pc-nav button:hover {
  transform: translateX(5px);
}

.pc-nav button span {
  color: #e2c28e;
  font-family: 'DM Mono', monospace;
  font-size: 12px;
}

.pc-side-bottom {
  margin-top: auto;
  border-top: 1px solid #426653;
  padding: 18px 10px;
  color: #c1d1c2;
  font-size: 13px;
  line-height: 1.8;
}

.pc-main {
  flex: 1;
  min-width: 0;
}

.pc-topbar {
  height: 68px;
  border-bottom: 1px solid #d7c8b3;
  background: #f8f5ee;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pc-breadcrumb {
  color: #626e63;
  font-size: 14px;
}

.pc-monogram {
  font-family: 'DM Serif Display', serif;
  color: #28513e;
  border: 1px solid #c8b89c;
  border-radius: 50%;
  padding: 7px;
}

.pc-content {
  max-width: 1400px;
  margin: auto;
  padding: 40px;
}

.pc-kicker {
  color: #994e4e;
  margin-bottom: 12px;
}

.pc-title {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: clamp(38px, 4vw, 57px);
  font-weight: 400;
  letter-spacing: -1px;
  margin-bottom: 10px;
}

.pc-description {
  color: #53685b;
  font-size: 15px;
  line-height: 1.7;
}

/* Homepage hero */

.pc-hero {
  background: #263f36;
  color: #fff7e9;
  padding: 35px;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 25px;
  border-radius: 9px;
  margin-bottom: 24px;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  animation: pcHeroEntrance .7s ease-out both;
}

.pc-hero > div {
  position: relative;
  z-index: 2;
}

.pc-hero h1 {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: clamp(40px, 5vw, 67px);
  font-weight: 400;
  line-height: 1.06;
  margin-bottom: 18px;
  color: #fff7e9 !important;
  text-shadow: 0 2px 12px rgba(0, 0, 0, .12);
}

.pc-hero h1 em {
  color: #e4c18c !important;
  font-style: normal;
}

.pc-hero p {
  color: #e0e8dc;
  line-height: 1.7;
  font-size: 15px;
  max-width: 510px;
}

.pc-hero .pc-kicker {
  color: #e6bc83;
}

.pc-hero-right {
  background: #36594a;
  padding: 25px;
  border-left: 3px solid #d5ad73;
  border-radius: 5px;
}

.pc-hero-right h2 {
  font-family: 'DM Serif Display', serif;
  font-weight: 400;
  font-size: 29px;
  margin-bottom: 10px;
  color: #fff7e9;
}

/* Floating decorative bubbles */

.pc-hero::before,
.pc-hero::after {
  content: "";
  position: absolute;
  display: block;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

.pc-hero::before {
  width: 155px;
  height: 155px;
  left: 45%;
  bottom: -90px;
  border: 1px solid rgba(230, 188, 131, .38);
  background: radial-gradient(
    circle at 35% 30%,
    rgba(230, 188, 131, .14),
    rgba(230, 188, 131, .02) 70%
  );
  box-shadow:
    -210px -90px 0 -65px rgba(230, 188, 131, .12),
    180px -120px 0 -45px rgba(230, 188, 131, .09),
    -90px -230px 0 -57px rgba(230, 188, 131, .09);
  animation: pcBubbleFloat 11s ease-in-out infinite alternate;
}

.pc-hero::after {
  width: 85px;
  height: 85px;
  left: 16%;
  bottom: -55px;
  border: 1px solid rgba(238, 211, 163, .4);
  background: rgba(238, 211, 163, .07);
  box-shadow:
    260px -80px 0 -25px rgba(238, 211, 163, .12),
    410px -210px 0 -32px rgba(238, 211, 163, .12),
    -70px -180px 0 -27px rgba(238, 211, 163, .12);
  animation: pcBubbleFloatTwo 14s ease-in-out infinite alternate;
}

@keyframes pcBubbleFloat {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: .45;
  }
  50% {
    opacity: .85;
  }
  100% {
    transform: translate(40px, -190px) rotate(18deg);
    opacity: .55;
  }
}

@keyframes pcBubbleFloatTwo {
  0% {
    transform: translate(0, 0) scale(.85);
    opacity: .35;
  }
  100% {
    transform: translate(-30px, -240px) scale(1.2);
    opacity: .75;
  }
}

@keyframes pcHeroEntrance {
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Buttons */

.pc-btn {
  background: #28523f;
  color: #fff9ef;
  border: 1px solid #28523f;
  border-radius: 6px;
  padding: 12px 17px;
  font-size: 14px;
  font-weight: 700;
  transition:
    transform .2s ease,
    box-shadow .2s ease,
    background .2s ease;
}

.pc-btn:hover:not(:disabled) {
  background: #3a7154;
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 15px #193c2b2e;
}

.pc-btn.alt {
  background: #fffaf1;
  color: #28523f;
  border-color: #cbbba4;
}

.pc-btn.alt:hover {
  background: #ece3d4;
}

.pc-btn.gold {
  background: #d6ae74;
  color: #243b30;
  border-color: #d6ae74;
}

.pc-btn.danger {
  background: #fff3ef;
  color: #984e4e;
  border-color: #d5a6a0;
}

.pc-btn.small {
  padding: 8px 11px;
}

/* Course library */

.pc-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
}

.pc-panel,
.pc-deck,
.pc-folder,
.pc-exam {
  background: #fffaf3;
  border: 1px solid #d9cbb6;
  border-radius: 9px;
  padding: 23px;
}

.pc-panel h2,
.pc-section-title {
  font-family: 'DM Serif Display', serif;
  font-weight: 400;
  font-size: 29px;
}

.pc-section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 28px 0 17px;
  gap: 15px;
}

.pc-section-head h2 {
  font-family: 'DM Serif Display', serif;
  font-size: 30px;
  font-weight: 400;
  margin: 0;
}

.pc-deck {
  text-align: left;
  color: #243d31;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  transition:
    transform .2s ease,
    box-shadow .2s ease,
    border-color .2s ease;
}

.pc-deck:hover,
.pc-folder:hover {
  border-color: #7b9b7e;
  transform: translateY(-6px) scale(1.015);
  box-shadow: 0 12px 24px #193c2b26;
}

.pc-deck-top {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.pc-code {
  color: #975354;
}

.pc-category {
  font-size: 13px;
  color: #536c5b;
}

.pc-deck h3 {
  font-family: 'DM Serif Display', serif;
  font-size: 25px;
  font-weight: 400;
  margin: 18px 0 8px;
}

.pc-deck-bottom {
  margin-top: auto;
  font-size: 14px;
  color: #536b5c;
}

.pc-track {
  height: 7px;
  background: #e1dfd3;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 13px;
}

.pc-track div {
  height: 100%;
  background: #4d8965;
  transition: width .35s ease;
}

/* Dashboard statistics */

.pc-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.pc-stat {
  padding: 20px;
  background: #fffaf3;
  border: 1px solid #d9cbb6;
  border-radius: 7px;
  animation: pcStatEntrance .6s ease-out both;
}

.pc-stat:nth-child(2) {
  animation-delay: .12s;
}

.pc-stat:nth-child(3) {
  animation-delay: .24s;
}

.pc-stat span {
  font-family: 'DM Mono', monospace;
  color: #735f50;
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: .5px;
}

.pc-stat strong {
  display: block;
  font-family: 'DM Serif Display', serif;
  font-size: 44px;
  font-weight: 400;
  margin-top: 7px;
}

@keyframes pcStatEntrance {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Inputs and forms */

.pc-input,
.pc-textarea,
.pc-select {
  width: 100%;
  background: #fffdf8 !important;
  color: #26382f !important;
  border: 1px solid #cdbfa9 !important;
  border-radius: 5px;
  padding: 12px;
  outline: none;
}

.pc-input:focus,
.pc-textarea:focus,
.pc-select:focus {
  border-color: #47825e !important;
}

.pc-textarea {
  min-height: 90px;
  resize: vertical;
}

.pc-form {
  display: grid;
  gap: 12px;
}

.pc-form-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.pc-form-row .pc-input {
  flex: 1;
  min-width: 170px;
}

.pc-toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin: 25px 0;
  flex-wrap: wrap;
}

.pc-toolbar .pc-input {
  max-width: 380px;
}

.pc-filters {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}

.pc-filters button {
  background: #e8e2d4;
  border: 1px solid transparent;
  color: #526a56;
  padding: 9px 12px;
  border-radius: 5px;
  font-size: 14px;
}

.pc-filters button.active {
  background: #28523f;
  color: white;
}

/* Folders */

.pc-folder {
  cursor: pointer;
  text-align: left;
  color: #263d30;
  transition: transform .2s ease, box-shadow .2s ease;
}

.pc-folder-icon {
  display: inline-block;
  font-size: 30px;
  color: #a56b53;
  margin-bottom: 12px;
  transition: transform .25s ease;
}

.pc-folder:hover .pc-folder-icon {
  transform: scale(1.25) rotate(-5deg);
}

.pc-folder h3 {
  font-family: 'DM Serif Display', serif;
  font-weight: 400;
  font-size: 25px;
  margin-bottom: 8px;
}

.pc-folder p {
  color: #617566;
  font-size: 14px;
}

.pc-folder-select {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid #e4d9c9;
  font-size: 14px;
}

.pc-folder-select input {
  accent-color: #32674b;
}

.pc-two-col {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 18px;
}

/* Exams and countdown */

.pc-exam {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.pc-exam strong {
  font-size: 18px;
}

.pc-exam p {
  font-size: 14px;
  color: #617466;
  margin: 6px 0;
}

.pc-count {
  font-family: 'DM Serif Display', serif;
  font-size: 40px;
  color: #8c4c4e;
  text-align: center;
  min-width: 80px;
}

.pc-count small {
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: #667569;
}

/* Multiple study set selection */

.pc-course-checklist {
  max-height: 260px;
  overflow-y: auto;
  border: 1px solid #cdbfa9;
  border-radius: 7px;
  background: #fffdf8;
  padding: 10px;
  display: grid;
  gap: 6px;
}

.pc-course-check {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background .2s ease, transform .2s ease;
}

.pc-course-check:hover {
  background: #e5f0e3;
  transform: translateX(3px);
}

.pc-course-check input {
  width: 19px;
  height: 19px;
  accent-color: #32674b;
  flex-shrink: 0;
}

.pc-course-check span {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pc-course-check strong {
  font-size: 15px;
}

.pc-course-check small {
  font-size: 13px;
  color: #647467;
}

/* Flashcards */

.pc-study-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 18px;
}

.pc-flashcard {
  width: 100%;
  min-height: 320px;
  background: #ede3d0;
  border: 1px solid #c7b79b;
  border-radius: 7px;
  box-shadow: 4px 5px 0 #d7c8af;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: 28px;
  color: #243b30;
  transition:
    transform .35s ease,
    box-shadow .2s ease,
    background .2s ease;
}

.pc-flashcard:hover {
  transform: scale(1.015);
  box-shadow: 5px 8px 18px #23462d26;
}

.pc-flashcard.flipped {
  background: #dce9dc;
  animation: pcFlip .35s ease;
}

@keyframes pcFlip {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(90deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

.pc-flashcard strong {
  font-family: 'DM Serif Display', serif;
  font-size: clamp(22px, 3vw, 35px);
  font-weight: 400;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.pc-flashcard small {
  color: #706d61;
  font-size: 14px;
}

.pc-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin: 20px 0;
}

.pc-rating {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.pc-rating button {
  padding: 14px;
  border: 1px solid #c6b39a;
  background: #f5e4c7;
  color: #795a32;
  border-radius: 5px;
}

.pc-rating button:last-child {
  background: #d9e9d9;
  color: #326448;
  border-color: #acc7ad;
}

.pc-progress-large {
  font-family: 'DM Serif Display', serif;
  font-size: 55px;
  margin: 15px 0;
}

.pc-progress-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-top: 15px;
  color: #536b5b;
}

.pc-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pc-tabs button {
  padding: 11px 15px;
  background: #e9e0d0;
  color: #315442;
  border: 0;
  border-radius: 5px;
}

.pc-tabs button.active {
  background: #28523f;
  color: white;
}

.pc-back {
  background: none;
  border: 0;
  color: #955252;
  padding: 0;
  margin-bottom: 25px;
}

/* Quizzes */

.pc-quiz-option {
  width: 100%;
  text-align: left;
  background: #fffdf7;
  border: 1px solid #d7c9b5;
  color: #26382f;
  padding: 16px;
  margin: 6px 0;
  border-radius: 5px;
  transition: transform .2s ease, background .2s ease;
}

.pc-quiz-option:hover:not(:disabled) {
  transform: translateX(6px);
  border-color: #47825e;
  background: #edf5e9;
}

.pc-quiz-option.correct {
  background: #d9e9d9;
  border-color: #5d966b;
}

.pc-quiz-option.wrong {
  background: #f5dcd9;
  border-color: #bc7878;
}

.pc-feedback {
  margin-top: 20px;
  padding: 18px;
  background: #eee8dc;
}

.pc-empty {
  text-align: center;
  padding: 35px;
  color: #617466;
}

.pc-review {
  border-bottom: 1px solid #dfd4c3;
  padding: 15px 0;
  font-size: 14px;
}

.pc-label {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 5px;
  display: block;
}

.pc-note {
  font-size: 14px;
  color: #617466;
  line-height: 1.6;
}

.pc-list {
  display: grid;
  gap: 12px;
}

.pc-check {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.pc-check input {
  accent-color: #32674b;
}

.pc-goal {
  background: #e0e9db;
  padding: 20px;
  border-radius: 7px;
}

.pc-goal strong {
  font-family: 'DM Serif Display', serif;
  font-size: 38px;
  font-weight: 400;
}

.pc-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.pc-quiz-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  background: #fffaf3;
  border: 1px solid #d9cbb6;
  padding: 18px;
  border-radius: 7px;
  margin-bottom: 10px;
}

.pc-quiz-row h3 {
  font-family: 'DM Serif Display', serif;
  font-size: 22px;
  font-weight: 400;
  margin: 5px 0;
}

.pc-quiz-row p {
  font-size: 14px;
  color: #617466;
  margin: 0;
}

/* Page transitions */

@keyframes pcFadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pc-content > div,
.pc-content > section {
  animation: pcFadeUp .35s ease both;
}

/* Responsive layout */

@media (max-width: 1100px) {
  .pc-grid {
    grid-template-columns: repeat(2, 1fr);
  }

.pc-two-col,
  .pc-hero {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 800px) {
  .pc-app {
    display: block;
  }

.pc-sidebar {
    position: static;
    width: 100%;
    height: auto;
    padding: 15px;
  }

.pc-logo {
    margin: 0 0 15px;
  }

.pc-side-label,
  .pc-side-bottom {
    display: none;
  }

.pc-nav {
    display: flex;
    overflow: auto;
  }

.pc-nav button {
    white-space: nowrap;
  }

.pc-content {
    padding: 22px;
  }

.pc-topbar {
    padding: 0 22px;
  }

.pc-study-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 550px) {
  .pc-grid,
  .pc-stats {
    grid-template-columns: 1fr;
  }

.pc-quiz-row {
    align-items: flex-start;
    flex-direction: column;
  }

.pc-hero h1 {
    font-size: 42px;
  }

.pc-rating {
    grid-template-columns: 1fr;
  }
}

/* Accessibility */

@media (prefers-reduced-motion: reduce) {
  .pc-hero,
  .pc-hero::before,
  .pc-hero::after,
  .pc-stat,
  .pc-content *,
  .pc-content > div,
  .pc-content > section {
    animation: none !important;
    transition: none !important;
  }
}
`;

export default function App() {
  const [data, setData] = useState(() => read(STORE, { custom: [], progress: {} }));
  const [history, setHistory] = useState(() => read(QUIZ_STORE, {}));
  const [extra, setExtra] = useState(() => read(EXTRA_STORE, {
    folders: [], exams: [], goal: 15, daily: {}
  }));

  const [page, setPage] = useState("dashboard");
  const [activeId, setActiveId] = useState(null);
  const [mode, setMode] = useState("study");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [position, setPosition] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [order, setOrder] = useState(null);

  const [deckName, setDeckName] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [folderName, setFolderName] = useState("");
  const [folderId, setFolderId] = useState(null);
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examDecks, setExamDecks] = useState([]);

  const [quiz, setQuiz] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [responses, setResponses] = useState([]);
  const [finished, setFinished] = useState(false);
  const [quizLength, setQuizLength] = useState(10);
  const [practiceOnly, setPracticeOnly] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORE, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem(QUIZ_STORE, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(EXTRA_STORE, JSON.stringify(extra));
  }, [extra]);

  const decks = [...COURSES, ...(data.custom || [])];
  const active = decks.find(d => d.id === activeId);
  const cards = active?.cards || [];
  const sequence = order || cards.map((_, i) => i);
  const cardIndex = sequence[position];
  const card = cards[cardIndex];
  const progress = data.progress?.[activeId] || {};

  const mastered = cards.filter((_, i) => progress[i] === "mastered").length;
  const reviewed = cards.filter((_, i) => progress[i]).length;
  const score = responses.filter(r => r.correct).length;
  const totalCards = decks.reduce((n, d) => n + d.cards.length, 0);
  const totalMastered = decks.reduce(
    (n, d) => n + d.cards.filter((_, i) => data.progress?.[d.id]?.[i] === "mastered").length, 0
  );
  const today = todayString();
  const dailyCount = extra.daily?.[today] || 0;
  const dailyGoal = extra.goal || 15;
  const goalPercent = Math.min(100, Math.round(dailyCount / dailyGoal * 100));
  const upcoming = [...(extra.exams || [])]
    .filter(e => daysUntil(e.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  function navigate(to) {
    setPage(to);
    setActiveId(null);
    setFolderId(null);
    setSearch("");
    setFilter("All");
    window.scrollTo(0, 0);
  }

  function openDeck(id, selectedMode = "study") {
    const deck = decks.find(d => d.id === id);
    if (!deck) return;
    setActiveId(id);
    setPosition(0);
    setOrder(null);
    setFlipped(false);
    setShowForm(false);
    setMode(selectedMode);
    if (selectedMode === "quiz") startQuiz(deck);
    window.scrollTo(0, 0);
  }

  function startQuiz(deck = active) {
    if (!deck || deck.cards.length < 4) return;
    setQuiz(makeQuiz(deck.cards, quizLength));
    setQuizIndex(0);
    setSelected(null);
    setResponses([]);
    setFinished(false);
    setMode("quiz");
  }

  function moveCard(direction) {
    setPosition(i => Math.max(0, Math.min(sequence.length - 1, i + direction)));
    setFlipped(false);
  }

  function rateCard(value) {
    setData(old => ({
      ...old,
      progress: {
        ...old.progress,
        [activeId]: { ...old.progress?.[activeId], [cardIndex]: value }
      }
    }));
    setExtra(old => ({
      ...old,
      daily: { ...old.daily, [today]: (old.daily?.[today] || 0) + 1 }
    }));
    if (position < sequence.length - 1) moveCard(1);
  }

  function createDeck(e) {
    e.preventDefault();
    if (!deckName.trim()) return;
    const id = crypto.randomUUID();
    const deck = {
      id, name: deckName.trim(), code: "PERSONAL",
      category: "Custom", custom: true, cards: []
    };
    setData(old => ({ ...old, custom: [...(old.custom || []), deck] }));
    setDeckName("");
    setPage("mydecks");
    openNewDeck(id);
  }

  function openNewDeck(id) {
    setActiveId(id);
    setPosition(0);
    setOrder(null);
    setFlipped(false);
    setMode("study");
  }

  function saveCard(e) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setData(old => ({
      ...old,
      custom: old.custom.map(d => {
        if (d.id !== activeId) return d;
        const updated = [...d.cards];
        if (editing === null) updated.push([question.trim(), answer.trim()]);
        else updated[editing] = [question.trim(), answer.trim()];
        return { ...d, cards: updated };
      }),
      progress: {
        ...old.progress,
        [activeId]: editing === null ? (old.progress?.[activeId] || {}) : {}
      }
    }));
    setQuestion("");
    setAnswer("");
    setEditing(null);
    setShowForm(false);
    setPosition(0);
    setOrder(null);
    setFlipped(false);
  }

  function deleteCard() {
    if (!confirm("Delete this flashcard?")) return;
    setData(old => ({
      ...old,
      custom: old.custom.map(d =>
        d.id === activeId
          ? { ...d, cards: d.cards.filter((_, i) => i !== cardIndex) }
          : d
      ),
      progress: { ...old.progress, [activeId]: {} }
    }));
    setPosition(0);
    setOrder(null);
    setFlipped(false);
  }

  function deleteDeck() {
    if (!confirm("Delete this deck and its flashcards?")) return;
    setData(old => ({
      ...old,
      custom: old.custom.filter(d => d.id !== activeId),
      progress: Object.fromEntries(
        Object.entries(old.progress || {}).filter(([id]) => id !== activeId)
      )
    }));
    setExtra(old => ({
      ...old,
      folders: old.folders.map(f => ({
        ...f, deckIds: f.deckIds.filter(id => id !== activeId)
      }))
    }));
    navigate("mydecks");
  }

  function createFolder(e) {
    e.preventDefault();
    if (!folderName.trim()) return;
    const folder = {
      id: crypto.randomUUID(),
      name: folderName.trim(),
      deckIds: []
    };
    setExtra(old => ({
      ...old,
      folders: [...old.folders, folder]
    }));
    setFolderName("");
  }

  function toggleFolderDeck(id, deckId) {
    setExtra(old => ({
      ...old,
      folders: old.folders.map(f => {
        if (f.id !== id) return f;
        return {
          ...f,
          deckIds: f.deckIds.includes(deckId)
            ? f.deckIds.filter(x => x !== deckId)
            : [...f.deckIds, deckId]
        };
      })
    }));
  }

  function deleteFolder(id) {
    if (!confirm("Delete this folder? Your actual study sets will stay saved.")) return;
    setExtra(old => ({
      ...old,
      folders: old.folders.filter(f => f.id !== id)
    }));
    setFolderId(null);
  }

  function renameFolder(id) {
    const folder = extra.folders.find(f => f.id === id);
    const name = prompt("New folder name:", folder?.name);
    if (!name?.trim()) return;
    setExtra(old => ({
      ...old,
      folders: old.folders.map(f =>
        f.id === id ? { ...f, name: name.trim() } : f
      )
    }));
  }

  function addExam(e) {
    e.preventDefault();
    if (!examName.trim() || !examDate) return;
    setExtra(old => ({
      ...old,
      exams: [...old.exams, {
        id: crypto.randomUUID(),
        name: examName.trim(),
        date: examDate,
        deckIds: [...examDecks]
      }]
    }));
    setExamName("");
    setExamDate("");
    setExamDecks([]);
  }

  function chooseAnswer(option) {
    if (selected !== null) return;
    setSelected(option);
    setResponses(old => [...old, {
      question: quiz[quizIndex].question,
      answer: quiz[quizIndex].answer,
      selected: option,
      correct: option === quiz[quizIndex].answer
    }]);
  }

  function nextQuestion() {
    if (quizIndex < quiz.length - 1) {
      setQuizIndex(i => i + 1);
      setSelected(null);
    } else {
      const percentage = Math.round(score / quiz.length * 100);
      setHistory(old => ({
        ...old,
        [activeId]: {
          last: percentage,
          best: Math.max(old[activeId]?.best || 0, percentage)
        }
      }));
      setFinished(true);
    }
  }

  function DeckCard({ deck }) {
    const count = deck.cards.filter(
      (_, i) => data.progress?.[deck.id]?.[i] === "mastered"
    ).length;
    const percent = deck.cards.length ? count / deck.cards.length * 100 : 0;

    return (
      <button className="pc-deck" onClick={() => openDeck(deck.id)}>
        <div className="pc-deck-top">
          <span className="pc-code">{deck.code}</span>
          <span className="pc-category">{deck.category}</span>
        </div>
        <h3>{deck.name}</h3>
        <div className="pc-deck-bottom">
          <div>{deck.cards.length} flashcards · {count} mastered</div>
          <div className="pc-track"><div style={{ width: `${percent}%` }} /></div>
          <div style={{ marginTop: 15, color: "#346a4d" }}>Open study set →</div>
        </div>
      </button>
    );
  }

  const categories = ["All", "Computer Science", "Mathematics", "Political Science", "Custom"];
  const visibleDecks = decks
    .filter(d => page !== "mydecks" || d.custom)
    .filter(d => filter === "All" || d.category === filter)
    .filter(d => `${d.name} ${d.code}`.toLowerCase().includes(search.toLowerCase()));

  const currentFolder = extra.folders.find(f => f.id === folderId);

  return (
    <>
      <style>{CSS}</style>
      <div className="pc-app">
        <aside className="pc-sidebar">
          <div className="pc-logo"><span>p.</span> peerconnect</div>
          <div className="pc-side-label">Workspace / Study tools</div>
          <nav className="pc-nav">
            {[
              ["dashboard", "01", "Overview"],
              ["library", "02", "Course library"],
              ["mydecks", "03", "My decks"],
              ["quizzes", "04", "Quiz center"],
              ["folders", "05", "My folders"],
              ["planner", "06", "Study planner"]
            ].map(([id, number, label]) => (
              <button key={id} className={page === id ? "active" : ""} onClick={() => navigate(id)}>
                <span>{number}</span>{label}
              </button>
            ))}
          </nav>
          <div className="pc-side-bottom">PEERCONNECT / STUDY TOOLS<br />BUILT FOR STUDENTS</div>
        </aside>

        <main className="pc-main">
          <header className="pc-topbar">
            <div className="pc-breadcrumb">Study tools / {active?.name || page.replace("dashboard", "Overview")}</div>
            <div className="pc-monogram">p.</div>
          </header>

          <div className="pc-content">
            {!active && page === "dashboard" && (
              <>
                <div className="pc-hero">
                  <div>
                    <div className="pc-kicker">Your study workspace</div>
                    <h1>Make every study session <em>count.</em></h1>
                    <p>Your classes, flashcards, exams, and study progress all in one place.</p>
                    <button className="pc-btn gold" onClick={() => navigate("library")}>
                      Browse course library →
                    </button>
                  </div>
                  <div className="pc-hero-right">
                    <div className="pc-kicker">Coming up next</div>
                    {upcoming.length ? (
                      <>
                        <h2>{upcoming[0].name}</h2>
                        <p>{daysUntil(upcoming[0].date)} days remaining</p>
                        <button className="pc-btn gold" onClick={() => navigate("planner")}>View study planner →</button>
                      </>
                    ) : (
                      <>
                        <h2>Stay ahead of your exams.</h2>
                        <p>Add an exam date and see your countdown here.</p>
                        <button className="pc-btn gold" onClick={() => navigate("planner")}>Add exam date →</button>
                      </>
                    )}
                  </div>
                </div>

                <div className="pc-stats">
                  <div className="pc-stat"><span>Study sets</span><strong>{decks.length}</strong></div>
                  <div className="pc-stat"><span>Flashcards</span><strong>{totalCards}</strong></div>
                  <div className="pc-stat"><span>Cards mastered</span><strong>{totalMastered}</strong></div>
                </div>

                <div className="pc-two-col" style={{ marginTop: 24 }}>
                  <section className="pc-panel">
                    <div className="pc-kicker">Daily progress</div>
                    <h2>Today's study goal</h2>
                    <div className="pc-goal">
                      <strong>{dailyCount} / {dailyGoal}</strong>
                      <p className="pc-note">Flashcard reviews completed today</p>
                      <div className="pc-track"><div style={{ width: `${goalPercent}%` }} /></div>
                    </div>
                    <div className="pc-actions">
                      <button className="pc-btn" onClick={() => navigate("library")}>Start studying →</button>
                      <button className="pc-btn alt" onClick={() => navigate("planner")}>Change goal</button>
                    </div>
                  </section>
                  <section className="pc-panel">
                    <div className="pc-kicker">Your organization</div>
                    <h2>My folders</h2>
                    <p className="pc-description">{extra.folders.length} folders created</p>
                    {extra.folders.slice(0, 3).map(f => (
                      <p key={f.id} className="pc-note">{f.name} · {f.deckIds.length} sets</p>
                    ))}
                    <button className="pc-btn alt" onClick={() => navigate("folders")}>Manage folders →</button>
                  </section>
                </div>

                <div className="pc-section-head">
                  <h2>From the course library</h2>
                  <button className="pc-btn alt small" onClick={() => navigate("library")}>View all courses →</button>
                </div>
                <div className="pc-grid">{decks.slice(0, 6).map(d => <DeckCard key={d.id} deck={d} />)}</div>
              </>
            )}

            {!active && (page === "library" || page === "mydecks") && (
              <>
                <div className="pc-kicker">Browse / Study sets</div>
                <h1 className="pc-title">{page === "library" ? "Course library" : "My decks"}</h1>
                <p className="pc-description">
                  {page === "library"
                    ? "Explore premade flashcards across different subjects."
                    : "Create and manage your own flashcard collections."}
                </p>

                <div className="pc-toolbar">
                  <input className="pc-input" placeholder="Search courses..." value={search}
                    onChange={e => setSearch(e.target.value)} />
                  <span className="pc-small">{visibleDecks.length} study sets</span>
                </div>

                {page === "library" && (
                  <div className="pc-filters" style={{ marginBottom: 22 }}>
                    {categories.map(c => (
                      <button key={c} className={filter === c ? "active" : ""} onClick={() => setFilter(c)}>{c}</button>
                    ))}
                  </div>
                )}

                <div className="pc-grid">
                  {visibleDecks.map(d => <DeckCard key={d.id} deck={d} />)}
                </div>

                {!visibleDecks.length && <div className="pc-empty">No study sets found.</div>}

                <section className="pc-panel" style={{ marginTop: 28 }}>
                  <div className="pc-kicker">Personal collections</div>
                  <h2>Create a study set</h2>
                  <p className="pc-description">Make a new deck and add your own questions and answers.</p>
                  <form className="pc-form-row" onSubmit={createDeck}>
                    <input className="pc-input" required placeholder="e.g. Midterm review"
                      value={deckName} onChange={e => setDeckName(e.target.value)} />
                    <button className="pc-btn">Create deck</button>
                  </form>
                </section>
              </>
            )}

            {!active && page === "folders" && (
              <>
                <div className="pc-kicker">Personal / Organization</div>
                <h1 className="pc-title">My folders</h1>
                <p className="pc-description">Organize study sets by subject, semester, favorites, or anything else.</p>

                {!currentFolder ? (
                  <>
                    <section className="pc-panel" style={{ margin: "25px 0" }}>
                      <h2>Create a folder</h2>
                      <form className="pc-form-row" onSubmit={createFolder}>
                        <input className="pc-input" required placeholder="e.g. Fall 2026 or Need to Practice"
                          value={folderName} onChange={e => setFolderName(e.target.value)} />
                        <button className="pc-btn">Create folder</button>
                      </form>
                    </section>
                    <div className="pc-grid">
                      {extra.folders.map(f => (
                        <button className="pc-folder" key={f.id} onClick={() => setFolderId(f.id)}>
                          <div className="pc-folder-icon">▰</div>
                          <h3>{f.name}</h3>
                          <p>{f.deckIds.length} study sets</p>
                          <span className="pc-code">Open folder →</span>
                        </button>
                      ))}
                    </div>
                    {!extra.folders.length && (
                      <div className="pc-empty">No folders yet. Create one above to get started.</div>
                    )}
                  </>
                ) : (
                  <>
                    <button className="pc-back" onClick={() => setFolderId(null)}>← All folders</button>
                    <h2 className="pc-section-title">{currentFolder.name}</h2>
                    <div className="pc-actions" style={{ marginBottom: 25 }}>
                      <button className="pc-btn alt" onClick={() => renameFolder(currentFolder.id)}>Rename folder</button>
                      <button className="pc-btn danger" onClick={() => deleteFolder(currentFolder.id)}>Delete folder</button>
                    </div>

                    <div className="pc-two-col">
                      <section>
                        <div className="pc-section-head"><h2>Study sets in this folder</h2></div>
                        <div className="pc-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))" }}>
                          {decks.filter(d => currentFolder.deckIds.includes(d.id))
                            .map(d => <DeckCard key={d.id} deck={d} />)}
                        </div>
                        {!currentFolder.deckIds.length && <p className="pc-note">No sets added yet.</p>}
                      </section>
                      <section className="pc-panel">
                        <h2>Add or remove sets</h2>
                        <p className="pc-note">Check the classes you want in this folder. One class can be in multiple folders.</p>
                        {decks.map(d => (
                          <label className="pc-folder-select" key={d.id}>
                            <input type="checkbox" checked={currentFolder.deckIds.includes(d.id)}
                              onChange={() => toggleFolderDeck(currentFolder.id, d.id)} />
                            {d.name}
                          </label>
                        ))}
                      </section>
                    </div>
                  </>
                )}
              </>
            )}

            {!active && page === "planner" && (
              <>
                <div className="pc-kicker">Planning / Your semester</div>
                <h1 className="pc-title">Study planner</h1>
                <p className="pc-description">Keep track of your exams and set a daily study goal.</p>

                <div className="pc-two-col" style={{ marginTop: 25 }}>
                  <section className="pc-panel">
                    <h2>Add an exam</h2>
                    <form className="pc-form" onSubmit={addExam}>
                      <label className="pc-label">Exam name</label>
                      <input className="pc-input" required placeholder="e.g. Operating Systems Final"
                        value={examName} onChange={e => setExamName(e.target.value)} />
                      <label className="pc-label">Exam date</label>
                      <input className="pc-input" type="date" required value={examDate}
                        onChange={e => setExamDate(e.target.value)} />
                      <label className="pc-label">Related study sets (optional)</label>
                      <div className="pc-course-checklist">
                        {decks.map(d => (
                          <label className="pc-course-check" key={d.id}>
                            <input type="checkbox" checked={examDecks.includes(d.id)}
                              onChange={() => setExamDecks(old =>
                                old.includes(d.id) ? old.filter(id => id !== d.id) : [...old, d.id]
                              )} />
                            <span>
                              <strong>{d.name}</strong>
                              <small>{d.code} · {d.cards.length} cards</small>
                            </span>
                          </label>
                        ))}
                      </div>
                      <p className="pc-note">{examDecks.length} study sets selected</p>
                      <button className="pc-btn">Save exam</button>
                    </form>
                  </section>
                  <section className="pc-panel">
                    <h2>Daily study goal</h2>
                    <p className="pc-description">Choose how many flashcards you want to review each day.</p>
                    <label className="pc-label">Cards per day</label>
                    <input className="pc-input" type="number" min="1" max="500" value={extra.goal || 15}
                      onChange={e => setExtra(old => ({ ...old, goal: Math.max(1, Number(e.target.value) || 1) }))} />
                    <div className="pc-goal" style={{ marginTop: 22 }}>
                      <strong>{dailyCount} / {dailyGoal}</strong>
                      <p className="pc-note">Today's completed reviews</p>
                      <div className="pc-track"><div style={{ width: `${goalPercent}%` }} /></div>
                    </div>
                  </section>
                </div>

                <div className="pc-section-head"><h2>Upcoming exams</h2></div>
                {upcoming.map(e => (
                  <div className="pc-exam" key={e.id}>
                    <div>
                      <strong>{e.name}</strong>
                      <p>{new Date(`${e.date}T00:00:00`).toLocaleDateString()}</p>
                      <div className="pc-actions">
                        {(e.deckIds || (e.deckId ? [e.deckId] : [])).map(id => {
                          const linked = decks.find(d => d.id === id);
                          return linked ? (
                            <button className="pc-btn small" key={id} onClick={() => openDeck(id)}>
                              Study {linked.name}
                            </button>
                          ) : null;
                        })}
                        <button className="pc-btn danger small" onClick={() =>
                          setExtra(old => ({ ...old, exams: old.exams.filter(x => x.id !== e.id) }))
                        }>Remove</button>
                      </div>
                    </div>
                    <div className="pc-count">{daysUntil(e.date)}<small>days left</small></div>
                  </div>
                ))}
                {!upcoming.length && <div className="pc-empty">No upcoming exams. Add one above.</div>}

                {extra.exams.some(e => daysUntil(e.date) < 0) && (
                  <>
                    <div className="pc-section-head"><h2>Past exams</h2></div>
                    {extra.exams.filter(e => daysUntil(e.date) < 0).map(e => (
                      <div className="pc-exam" key={e.id}>
                        <div><strong>{e.name}</strong><p>{e.date}</p></div>
                        <button className="pc-btn danger small" onClick={() =>
                          setExtra(old => ({ ...old, exams: old.exams.filter(x => x.id !== e.id) }))
                        }>Remove</button>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}

            {!active && page === "quizzes" && (
              <>
                <div className="pc-kicker">Practice / Self assessment</div>
                <h1 className="pc-title">Quiz center</h1>
                <p className="pc-description">Practice with multiple-choice questions created from your flashcards.</p>

                <div className="pc-panel" style={{ margin: "25px 0" }}>
                  <h2>Quiz settings</h2>
                  <div className="pc-form-row">
                    <label className="pc-label">Questions per quiz</label>
                    <select className="pc-select" style={{ maxWidth: 180 }}
                      value={quizLength} onChange={e => setQuizLength(Number(e.target.value))}>
                      <option value={5}>5 questions</option>
                      <option value={10}>10 questions</option>
                      <option value={20}>20 questions</option>
                    </select>
                  </div>
                  <p className="pc-note">Shorter decks will use however many cards are available.</p>
                </div>

                {decks.map(d => (
                  <div className="pc-quiz-row" key={d.id}>
                    <div>
                      <span className="pc-code">{d.code}</span>
                      <h3>{d.name}</h3>
                      <p>{d.cards.length} available cards · Best score: {history[d.id]?.best !== undefined ? `${history[d.id].best}%` : "Not attempted"}</p>
                    </div>
                    <button className="pc-btn" disabled={d.cards.length < 4}
                      onClick={() => openDeck(d.id, "quiz")}>Start quiz →</button>
                  </div>
                ))}
              </>
            )}

            {active && (
              <>
                <button className="pc-back" onClick={() => navigate(active.custom ? "mydecks" : "library")}>
                  ← Back to {active.custom ? "My decks" : "Course library"}
                </button>
                <div className="pc-kicker">{active.code} / {active.category}</div>
                <h1 className="pc-title">{active.name}</h1>
                <p className="pc-description">{cards.length} flashcards in this study set.</p>

                <div className="pc-tabs" style={{ margin: "25px 0" }}>
                  <button className={mode === "study" ? "active" : ""}
                    onClick={() => setMode("study")}>Flashcards</button>
                  <button className={mode === "quiz" ? "active" : ""}
                    disabled={cards.length < 4} onClick={() => startQuiz()}>Practice quiz</button>
                </div>

                {mode === "study" && (
                  <div className="pc-study-grid">
                    <section>
                      {cards.length ? (
                        <>
                          <button className={`pc-flashcard ${flipped ? "flipped" : ""}`}
                            onClick={() => setFlipped(!flipped)}>
                            <small>{flipped ? "ANSWER" : "QUESTION"} · CLICK TO FLIP</small>
                            <strong>{flipped ? card[1] : card[0]}</strong>
                            <small>{position + 1} / {sequence.length}</small>
                          </button>
                          <div className="pc-controls">
                            <button className="pc-btn alt" disabled={position === 0}
                              onClick={() => moveCard(-1)}>← Previous</button>
                            <span className="pc-small">Card {position + 1} of {sequence.length}</span>
                            <button className="pc-btn alt" disabled={position === sequence.length - 1}
                              onClick={() => moveCard(1)}>Next →</button>
                          </div>
                          <div className="pc-rating">
                            <button onClick={() => rateCard("review")}>Need practice</button>
                            <button onClick={() => rateCard("mastered")}>Got it / Mastered</button>
                          </div>
                          {active.custom && (
                            <div className="pc-actions">
                              <button className="pc-btn alt" onClick={() => {
                                setEditing(cardIndex);
                                setQuestion(card[0]);
                                setAnswer(card[1]);
                                setShowForm(true);
                              }}>Edit this card</button>
                              <button className="pc-btn danger" onClick={deleteCard}>Delete this card</button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="pc-panel pc-empty">
                          <h2>No flashcards yet</h2>
                          <p>Add your first question and answer below.</p>
                        </div>
                      )}

                      {active.custom && (
                        <div className="pc-panel" style={{ marginTop: 25 }}>
                          <h2>{editing !== null ? "Edit flashcard" : "Add flashcards"}</h2>
                          {!showForm ? (
                            <button className="pc-btn" onClick={() => {
                              setEditing(null);
                              setQuestion("");
                              setAnswer("");
                              setShowForm(true);
                            }}>+ Add a card</button>
                          ) : (
                            <form className="pc-form" onSubmit={saveCard}>
                              <label className="pc-label">Question</label>
                              <textarea className="pc-textarea" required value={question}
                                onChange={e => setQuestion(e.target.value)} />
                              <label className="pc-label">Answer</label>
                              <textarea className="pc-textarea" required value={answer}
                                onChange={e => setAnswer(e.target.value)} />
                              <div className="pc-actions">
                                <button className="pc-btn">Save flashcard</button>
                                <button type="button" className="pc-btn alt" onClick={() => {
                                  setShowForm(false);
                                  setEditing(null);
                                }}>Cancel</button>
                              </div>
                            </form>
                          )}
                        </div>
                      )}
                    </section>

                    <aside className="pc-panel">
                      <div className="pc-kicker">Study progress</div>
                      <div className="pc-progress-large">
                        {cards.length ? Math.round(mastered / cards.length * 100) : 0}%
                      </div>
                      <div className="pc-track">
                        <div style={{ width: `${cards.length ? mastered / cards.length * 100 : 0}%` }} />
                      </div>
                      <div className="pc-progress-row"><span>Mastered</span><b>{mastered}</b></div>
                      <div className="pc-progress-row"><span>Need practice</span><b>{cards.filter((_, i) => progress[i] === "review").length}</b></div>
                      <div className="pc-progress-row"><span>Not reviewed</span><b>{cards.length - reviewed}</b></div>

                      <div className="pc-actions" style={{ flexDirection: "column", marginTop: 25 }}>
                        <button className="pc-btn alt" onClick={() => {
                          setOrder(shuffle(cards.map((_, i) => i)));
                          setPosition(0);
                          setFlipped(false);
                          setPracticeOnly(false);
                        }}>Shuffle cards</button>
                        <button className="pc-btn alt" onClick={() => {
                          const weak = cards.map((_, i) => i).filter(i => progress[i] === "review");
                          if (!weak.length) {
                            alert("Mark some cards as Need practice first.");
                            return;
                          }
                          setOrder(shuffle(weak));
                          setPosition(0);
                          setFlipped(false);
                          setPracticeOnly(true);
                        }}>Review difficult cards</button>
                        {practiceOnly && <button className="pc-btn alt" onClick={() => {
                          setOrder(null);
                          setPosition(0);
                          setPracticeOnly(false);
                        }}>Show all cards</button>}
                        {active.custom && <button className="pc-btn danger" onClick={deleteDeck}>Delete deck</button>}
                      </div>
                    </aside>
                  </div>
                )}

                {mode === "quiz" && (
                  <div className="pc-panel" style={{ maxWidth: 850, margin: "auto" }}>
                    {finished ? (
                      <>
                        <div className="pc-kicker">Quiz complete</div>
                        <h2>Quiz results</h2>
                        <div className="pc-progress-large">{Math.round(score / quiz.length * 100)}%</div>
                        <p>{score} correct out of {quiz.length} questions</p>
                        <p className="pc-note">Personal best: {history[activeId]?.best}%</p>

                        {responses.some(r => !r.correct) && (
                          <>
                            <h2 style={{ marginTop: 30 }}>Questions to review</h2>
                            {responses.filter(r => !r.correct).map((r, i) => (
                              <div className="pc-review" key={i}>
                                <strong>{r.question}</strong>
                                <p>Your answer: {r.selected}</p>
                                <p>Correct answer: {r.answer}</p>
                              </div>
                            ))}
                          </>
                        )}
                        <div className="pc-actions">
                          <button className="pc-btn" onClick={() => startQuiz()}>Retake quiz</button>
                          <button className="pc-btn alt" onClick={() => setMode("study")}>Review flashcards</button>
                        </div>
                      </>
                    ) : quiz.length > 0 && (
                      <>
                        <div className="pc-form-row" style={{ justifyContent: "space-between" }}>
                          <span className="pc-small">Question {quizIndex + 1} / {quiz.length}</span>
                          <span className="pc-small">{score} correct</span>
                        </div>
                        <div className="pc-track">
                          <div style={{ width: `${(quizIndex + 1) / quiz.length * 100}%` }} />
                        </div>
                        <h2 style={{ margin: "30px 0" }}>{quiz[quizIndex].question}</h2>
                        {quiz[quizIndex].options.map((option, i) => (
                          <button key={i} disabled={selected !== null}
                            className={`pc-quiz-option ${selected !== null
                              ? option === quiz[quizIndex].answer ? "correct"
                                : option === selected ? "wrong" : ""
                              : ""}`}
                            onClick={() => chooseAnswer(option)}>
                            {String.fromCharCode(65 + i)}. {option}
                          </button>
                        ))}
                        {selected !== null && (
                          <div className="pc-feedback">
                            <h3>{selected === quiz[quizIndex].answer ? "Correct!" : "Not quite."}</h3>
                            <p>Correct answer: {quiz[quizIndex].answer}</p>
                            <button className="pc-btn" onClick={nextQuestion}>
                              {quizIndex === quiz.length - 1 ? "View results" : "Next question →"}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
