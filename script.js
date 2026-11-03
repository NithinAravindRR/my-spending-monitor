let expenses = JSON.parse(localStorage.getItem('mySavedExpenses')) || [];

window.onload = function() {
       const today = new Date();
       const currentYearMonth = today.toISOString().substring(0, 7);

       document.getElementById('filterMonth').value = currentYearMonth;
       document.getElementById('expenseDate').value = today.toISOString().substring(0, 10);

       renderExpenses();
 };

function addExpenses() {
       const nameInput = document.getElementById('expenseName');
       const amountInput = document.getElementById('expenseAmount');
       const dateInput = document.getElementById('expenseDate');
       const categoryInput = document.getElementById('expenseCategory');

       if (nameInput.value.trim() === '' || amountInput.value === '' || dateInput.value === '') {
            alert('please fill out all fields, including the transaction date!');
            return;
        }

       const newExpense = {
             id: Date.now(),
             name: nameInput.value,
             amount: parseFloat(amountInput.value),
             date: dateInput.value,
             category: categoryInput.value,
       };

       expenses.push(newExpense);
     
       saveToLocalStorage();
     
       nameInput.value = '';
       amountInput.value = '';

       renderExpenses();

 }
function saveToLocalStorage() {
       localStorage.setItem('mySavedExpenses', JSON.stringify(expenses));
 }

function deleteExpenses(targetId) {
       expenses = expenses.filter(expense => expense.id !== targetId);
       saveToLocalStorage();
       renderExpenses();
 }
function renderExpenses() {
      const tableBody = document.getElementById('expenseTableBody');
      const selectedCategory = document.getElementById('filterCategory').value;
      const selectedMonth = document.getElementById('filterMonth').value;
      const totalAmountSpan = document.getElementById('totalAmount');

      tableBody.innerHTML = '';

      let runningTotal = 0;
  
      expenses.forEach(expense => {
           const expenseMonth = expense.date.substring(0, 7);
           if (expenseMonth === selectedMonth && (selectedCategory === 'All' || expenseCategory === selectedCategory)) {

               const row = `<tr>
                    <td>${expense.date}</td>
                    <td>${expense.name}</td>
                    <td>${expense.category}</td>
                    <td>${expense.amount.toFixed(2)}</td>
                    <td>
                       <button class="btn-delete" onclick="deleteExpenses(${expense.id})">Delete</button>
                    </td>
               </tr>`;

               tableBody.innerHTML += row;

               runningTotal += expense.amount;
            }
    });

    totalAmountSpan.innerText = runningTotal.toFixed(2);

 }
            