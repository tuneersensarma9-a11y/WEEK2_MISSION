let salary = 0;
let expenses = [];
let chart; 

// DOM elements
const salaryInput = document.getElementById("salaryInput");
const setSalaryBtn = document.getElementById("setSalaryBtn");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const expenseList = document.getElementById("expenseList");

const salaryDisplay = document.getElementById("salary");
const totalExpensesDisplay = document.getElementById("totalExpenses");
const balanceDisplay = document.getElementById("balance");
const balanceText = document.getElementById("balanceText");

// Event Listeners
setSalaryBtn.addEventListener("click", setSalary);
addExpenseBtn.addEventListener("click", addExpense);

// Set Salary
function setSalary() {
  const value = Number(salaryInput.value);

  if (value <= 0) {
    alert("Enter valid salary");
    return;
  }

  salary = value;
  localStorage.setItem("salary", salary);
  salaryDisplay.innerText = salary.toLocaleString("en-IN");

  updateUI();
}

// Add Expense
function addExpense() {
  // Prevent adding expense if salary not set or invalid
  if ( salary <= 0) {
    alert("Please set a valid salary first");
    return;
  }

  const name = expenseName.value.trim();
  const amount = Number(expenseAmount.value);

  if (name === "" || amount <= 0) {
    alert("Enter valid expense");
    return;
  }

  const expense = { name, amount };
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  renderExpenses();
  clearInputs();
  updateUI();
}
// Render Expense List
function renderExpenses() {
  expenseList.innerHTML = "";

  expenses.forEach((exp, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${exp.name}: ₹${exp.amount.toLocaleString("en-IN")}
      <button class="delete-btn" onclick="deleteExpense(${index})">
  <i class="fa-solid fa-trash"></i>
</button>
    `;

    expenseList.appendChild(li);
  });
}

// Update UI
function updateUI() {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = salary - total;

  totalExpensesDisplay.innerText = total.toLocaleString("en-IN");
  balanceDisplay.innerText = balance.toLocaleString("en-IN");
  balanceText.className = balance < 0 ? "negative" : "positive";
  //Chart
  updateChart();
}

// Clear Inputs
function clearInputs() {
  expenseName.value = "";
  expenseAmount.value = "";
}
//Trash Button
function deleteExpense(index) {
  expenses.splice(index, 1);
   localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
  updateUI();
}
//Load Data
function loadData() {
  const savedSalary = localStorage.getItem("salary");
  const savedExpenses = localStorage.getItem("expenses");

  if (savedSalary) {
    salary = Number(savedSalary);
    salaryDisplay.innerText = salary;
  }

  if (savedExpenses) {
    expenses = JSON.parse(savedExpenses);
    renderExpenses();
  }

  updateUI();
}

//CALL Function
loadData();
//Chart Function
function updateChart() {
  const canvas = document.getElementById("expenseChart");

  // Check
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = salary - total;

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Total Expenses", "Remaining Balance"],
      datasets: [{
        data: [total, Math.max(balance, 0)],
        backgroundColor: ["#ff4d4d", "#4caf50"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",   
          labels: {
            color: "white"      
          }
        }
      }
    }
  });
}