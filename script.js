let balance = 0;
let savedAmount = 0;
let spendable = 0;
let userEmail = '';

function login() {
  const emailInput = document.getElementById('email');
  const email = emailInput.value.trim();

  if (email === '') {
    alert('Please enter a valid email');
    return;
  }

  userEmail = email;
  document.getElementById('userEmail').innerText = email;
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('tracker-section').style.display = 'block';

  updateBalances();
  showNotification(`Welcome ${userEmail}, your current balance is ₹${balance}`);
}

function addTransaction() {
  const title = document.getElementById('title').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;

  if (!title || isNaN(amount) || amount <= 0) {
    alert('Please enter a valid title and amount');
    return;
  }

  const transactionList = document.getElementById('transactions');
  const li = document.createElement('li');
  li.textContent = `${title} - ₹${amount} [${type}]`;

  let savingAmount = 0;

  if (type === 'income') {
    const saving = prompt("How much would you like to save from this income?");
    savingAmount = parseFloat(saving);

    if (isNaN(savingAmount) || savingAmount < 0 || savingAmount > amount) {
      alert("Invalid saving amount. No saving will be added.");
      savingAmount = 0;
    }

    savedAmount += savingAmount;
    balance += amount;
    spendable += (amount - savingAmount);
  } else if (type === 'expense') {
    if (amount > spendable) {
      alert("Not enough spendable balance! Cannot use saved amount.");
      return;
    }
    balance -= amount;
    spendable -= amount;
  }

  // Store transaction data for deletion
  li.dataset.amount = amount;
  li.dataset.type = type;
  li.dataset.saving = savingAmount;

  if (type === 'expense') li.classList.add('expense');

  // Add delete button
  const delBtn = document.createElement('button');
  delBtn.textContent = '🗑️';
  delBtn.style.float = 'right';
  delBtn.style.background = 'transparent';
  delBtn.style.border = 'none';
  delBtn.style.cursor = 'pointer';
  delBtn.onclick = () => deleteTransaction(li);
  li.appendChild(delBtn);

  transactionList.appendChild(li);

  updateBalances();
  showNotification(`${userEmail}, your spendable balance is now ₹${spendable}`);

  // Clear inputs
  document.getElementById('title').value = '';
  document.getElementById('amount').value = '';
}

function deleteTransaction(li) {
  const amount = parseFloat(li.dataset.amount);
  const type = li.dataset.type;
  const savingAmount = parseFloat(li.dataset.saving || 0);

  if (type === 'income') {
    balance -= amount;
    savedAmount -= savingAmount;
    spendable -= (amount - savingAmount);
  } else if (type === 'expense') {
    balance += amount;
    spendable += amount;
  }

  li.remove();
  updateBalances();
  showNotification(`Transaction deleted. Spendable balance: ₹${spendable}`);
}

function updateBalances() {
  document.getElementById('balance').innerText = balance;
  document.getElementById('saved').innerText = savedAmount;
  document.getElementById('spendable').innerText = spendable;
}

function showNotification(message) {
  const popup = document.getElementById('popup');
  const popupMessage = document.getElementById('popup-message');

  popupMessage.innerText = message;
  popup.style.display = 'block';

  // Play notification sound
  const audio = new Audio('notification.mp3');
  audio.play();
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
}
