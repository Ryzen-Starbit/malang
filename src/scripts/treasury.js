const treasuryURL = "https://script.google.com/macros/s/AKfycbwPgC8mtrQFktYnjVMWMzejbVLcUGkM38TnAh11TdVsegCsSID1B3XL1w-ow3Bhsv-2kw/exec";

async function loadTreasuryTotal() {
    try {
        const res = await fetch(treasuryURL);
        const data = await res.json();
        document.getElementById("treasury-total").innerText = `₹ ${data.total}/-`;
    } catch {
        document.getElementById("treasury-total").innerText = "Couldn't Fetch.";
    }
}

function logTransaction(e) {
    e.preventDefault();

    handleButtonAction(
        "log-btn",
        "Logging",
        "Logged",
        async () => {
            const header = document.getElementById("header").value.trim();
            const amountInput = document.getElementById("amount");
            let amount = parseFloat(amountInput.value.trim());
            const sign = document.querySelector('input[name="sign"]:checked').value;

            if (isNaN(amount) || amount <= 0) {
                showAlert("Invalid Input", "Amount must be greater than 0.", [{ text: "OK" }]);
                throw new Error("Invalid amount");
            }

            if (sign === "-") amount = -amount;

            const formData = new FormData();
            formData.append("mode", "add");
            formData.append("header", header);
            formData.append("amount", amount);

            const res = await fetch(treasuryURL, { method: "POST", body: formData });
            const text = await res.text();

            if (!text.toLowerCase().includes("success")) {
                showAlert("Error", text, [{ text: "OK" }]);
                throw new Error("Failed");
            }

            showAlert("Success", "Transaction logged.", [{ text: "OK" }]);
            document.getElementById("treasury-form").reset();
            document.getElementById("minus").checked = true;
            loadTreasuryTotal();
        },
        "Failed"
    );
}

loadTreasuryTotal();
