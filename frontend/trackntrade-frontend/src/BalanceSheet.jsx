import React, { useState } from 'react';
import { AIChatSession } from './../service/AIModel';

function BalanceSheet() {
  const [cash, setCash] = useState('');
  const [accountsReceivable, setAccountsReceivable] = useState('');
  const [inventory, setInventory] = useState('');
  const [property, setProperty] = useState('');
  const [investments, setInvestments] = useState('');
  const [accountsPayable, setAccountsPayable] = useState('');
  const [shortTermDebt, setShortTermDebt] = useState('');
  const [longTermDebt, setLongTermDebt] = useState('');
  const [ownersEquity, setOwnersEquity] = useState('');
  const [retainedEarnings, setRetainedEarnings] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prompt = `
      Generate a balance sheet based on the following data with proper notes and also give total assets, total liabilities, and total equity. use the Formula that Assets = Liabilities + Equity and if this is violated type try again at the bottom :
      - Assets:
        - Cash: ${cash}
        - Accounts Receivable: ${accountsReceivable}
        - Inventory: ${inventory}
        - Property, Plant, and Equipment: ${property}
        - Investments: ${investments}
      - Liabilities:
        - Accounts Payable: ${accountsPayable}
        - Short-Term Debt: ${shortTermDebt}
        - Long-Term Debt: ${longTermDebt}
      - Equity:
        - Owner's Equity: ${ownersEquity}
        - Retained Earnings: ${retainedEarnings}
    `;

    try {
      const response = await AIChatSession.sendMessage(prompt);
      console.log(prompt);
      const aiResponseText = await response.response.text();
      const parsedResponse = JSON.parse(aiResponseText);
      setAiResponse(parsedResponse);
    } catch (error) {
      console.error("Failed to generate AI summary:", error);
    }
  };

  return (
    <form>
      <h2>Balance Sheet</h2>

      <h3>Assets</h3>
      <input type="number" placeholder="Cash" value={cash} onChange={(e) => setCash(e.target.value)} />
      <input type="number" placeholder="Accounts Receivable" value={accountsReceivable} onChange={(e) => setAccountsReceivable(e.target.value)} />
      <input type="number" placeholder="Inventory" value={inventory} onChange={(e) => setInventory(e.target.value)} />
      <input type="number" placeholder="Property, Plant, and Equipment" value={property} onChange={(e) => setProperty(e.target.value)} />
      <input type="number" placeholder="Investments" value={investments} onChange={(e) => setInvestments(e.target.value)} />

      <h3>Liabilities</h3>
      <input type="number" placeholder="Accounts Payable" value={accountsPayable} onChange={(e) => setAccountsPayable(e.target.value)} />
      <input type="number" placeholder="Short-Term Debt" value={shortTermDebt} onChange={(e) => setShortTermDebt(e.target.value)} />
      <input type="number" placeholder="Long-Term Debt" value={longTermDebt} onChange={(e) => setLongTermDebt(e.target.value)} />

      <h3>Equity</h3>
      <input type="number" placeholder="Owner's Equity" value={ownersEquity} onChange={(e) => setOwnersEquity(e.target.value)} />
      <input type="number" placeholder="Retained Earnings" value={retainedEarnings} onChange={(e) => setRetainedEarnings(e.target.value)} />

      <button onClick={handleSubmit} type="submit">Generate Balance Sheet</button>

      {aiResponse && (
        <div>
          <h3>AI Generated Balance Sheet:</h3>
          <pre>{JSON.stringify(aiResponse, null, 2)}</pre>
        </div>
      )}
    </form>
  );
}

export default BalanceSheet;
