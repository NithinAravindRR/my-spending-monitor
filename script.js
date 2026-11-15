// 1. Firebase Imports (including Firestore for your database)
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://gstatic.com";

// 2. Your Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAb4evvG1xzy5DZh_GZ-_QIa-JmSKuBDug",
  authDomain: "spending-2aad7.firebaseapp.com",
  projectId: "spending-2aad7",
  storageBucket: "spending-2aad7.firebasestorage.app",
  messagingSenderId: "201811004812",
  appId: "1:201811004812:web:1fd252016ba105b15d9aa9",
  measurementId: "G-ZKFHL3PTBF"
};

// 3. Initialize Firebase & Firestore Database
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let expenses = [];

// 4. Load saved expenses from Firebase
async function loadFromFirebase() {
  const querySnapshot = await getDocs(collection(db, "expenses"));
  expenses = [];
  querySnapshot.forEach((docItem) => {
    // Store Firebase's unique document ID so we can delete it later
    expenses.push({ firebaseId: docItem.id, ...docItem.data() });
  });
  renderExpenses();
}

// 5. Run when the page opens
window.onload = async function() {
  const today = new Date();
  const currentYearMonth = today.toISOString().substring(0, 7);

  document.getElementById('filterMonth').value = currentYearMonth;
  document.getElementById('expenseDate').value = today.toISOString().substring(0, 10);

  await loadFromFirebase();
};

// 6. Add a new expense to Firebase
async function addExpenses() {
  const nameInput = document.getElementById('expenseName');
  const amountInput = document.getElementById('expenseAmount');
  const dateInput = document.getElementById('expenseDate');
  const categoryInput = document.getElementById('expenseCategory');

  if (nameInput.value.trim() === '' || amountInput.value === '' || dateInput.value === '') {
    alert('please fill out all fields, including the transaction date!');
    return;
  }

  const newExpense = {
    name: nameInput.value,
    amount: parseFloat(amountInput.value),
    date: dateInput.value,
    category: categoryInput.value,
  };

  // Save to Firebase and get its new ID
  const docRef = await addDoc(collection(db, "expenses"), newExpense);
  expenses.push({ firebaseId: docRef.id, ...newExpense });

  nameInput.value = '';
  amountInput.value = '';

  renderExpenses();
}

// 7. Delete an expense from Firebase
async function deleteExpenses(targetFirebaseId) {
  const expenseToDelete = expenses.find(expense => expense.firebaseId === targetFirebaseId);
  const expenseName = expenseToDelete ? expenseToDelete.name : 'this expense';

  const userConfirmed = window.confirm(`Are you sure you want to delete "${expenseName}"?`);

  if (userConfirmed) {
    // Delete from Firebase cloud
    await deleteDoc(doc(db, "expenses", targetFirebaseId));

    // Remove from screen list
    expenses = expenses.filter(expense => expense.firebaseId !== targetFirebaseId);
    renderExpenses();
  }
}

// 8. Display expenses on your table
function renderExpenses() {
  const tableBody = document.getElementById('expenseTableBody');
  const selectedCategory = document.getElementById('filterCategory').value;
  const selectedMonth = document.getElementById('filterMonth').value;
  const totalAmountSpan = document.getElementById('totalAmount');

  tableBody.innerHTML = '';
  let runningTotal = 0;

  expenses.forEach(expense => {
    const expenseMonth = expense.date.substring(0, 7);
    if (expenseMonth === selectedMonth && (selectedCategory === 'All' || expense.category === selectedCategory)) {
      const row = `<tr>
        <td>${expense.date}</td>
        <td>${expense.name}</td>
        <td>${expense.category}</td>
        <td>${expense.amount.toFixed(2)}</td>
        <td>
          <button class="btn-delete" onclick="deleteExpenses('${expense.firebaseId}')">Delete</button>
        </td>
      </tr>`;

      tableBody.innerHTML += row;
      runningTotal += expense.amount;
    }
  });

  totalAmountSpan.innerText = runningTotal.toFixed(2);
}

// 9. Make functions visible to your HTML onclick buttons
window.addExpenses = addExpenses;
window.deleteExpenses = deleteExpenses;
window.renderExpenses = renderExpenses;
