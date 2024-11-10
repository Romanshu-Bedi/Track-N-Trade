// import React, { useState } from 'react';
import { AIChatSession } from './../service/AIModel';
import { useUser } from '@clerk/clerk-react';
import React, { useState, useEffect } from 'react';

function BalanceSheet() {
  const { user } = useUser();
  const clerkId = user?.id;
  const [userId, setUserId] = useState(null);
  const [pettyCash, setPettyCash] = useState('');
  const [temporaryInvestments, setTemporaryInvestments] = useState('');
  const [supplies, setSupplies] = useState('');
  const [prepaidInsurance, setPrepaidInsurance] = useState('');
  const [land, setLand] = useState('');
  const [landImprovements, setLandImprovements] = useState('');
  const [buildings, setBuildings] = useState('');
  const [equipment, setEquipment] = useState('');
  const [accumDepreciation, setAccumDepreciation] = useState('');
  const [goodwill, setGoodwill] = useState('');
  const [tradeNames, setTradeNames] = useState('');
  const [otherAssets, setOtherAssets] = useState('');
  const [notesPayable, setNotesPayable] = useState('');
  const [wagesPayable, setWagesPayable] = useState('');
  const [interestPayable, setInterestPayable] = useState('');
  const [taxesPayable, setTaxesPayable] = useState('');
  const [warrantyLiability, setWarrantyLiability] = useState('');
  const [unearnedRevenue, setUnearnedRevenue] = useState('');
  const [bondsPayable, setBondsPayable] = useState('');
  const [commonStock, setCommonStock] = useState('');
  const [otherComprehensiveIncome, setOtherComprehensiveIncome] = useState('');
  const [treasuryStock, setTreasuryStock] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [cash, setCash] = useState('');
const [accountsReceivable, setAccountsReceivable] = useState('');
 const [investments, setInvestments] = useState('');



  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/user-id?clerk_id=${clerkId}`);
        const data = await response.json();
        if (response.ok) {
          setUserId(data.user_id);
          console.log('user_id:', userId);
        } else {
          console.error('Failed to fetch user ID:', data.error);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    if (clerkId) {
      fetchUserId();
      console.log('clerkId:', clerkId); 
      console.log('userId:', userId);
    }
  }, [clerkId]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const salesResponse = await fetch(`http://localhost:3001/api/sales?user_id=${userId}`);
    console.log('Sales Response:', salesResponse);
    const salesData = await salesResponse.json();
    console.log('Sales Data:', salesData);
    const totalSales = salesData.reduce((acc, sale) => acc + (sale.sale_price * sale.quantity), 0);
    console.log('Total Sales:', totalSales);

    // Fetch inventory data
    const inventoryResponse = await fetch(`http://localhost:3001/api/inventory?user_id=${userId}`);
    const inventoryData = await inventoryResponse.json();
    const totalInventoryValue = inventoryData.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    console.log('Total Inventory Value:', totalInventoryValue);


    const prompt = `
      Generate a balance sheet based on the following data with proper notes and also give total assets, total liabilities, and total equity. use the Formula that Assets = Liabilities + Equity and if this is violated type try again at the bottom and set return earnigns yourself:
      - Total Sales: ${totalSales}
        - Total Inventory Value: ${totalInventoryValue}
        - Assets:
        - Cash: ${cash} // Cash is calculated by adding all the current assets
        - Petty Cash: ${pettyCash}
        - Temporary Investments: ${temporaryInvestments}
        - Accounts Receivable: ${accountsReceivable} // Accounts Receivable is calculated by adding all the current assets
        - Inventory: ${totalInventoryValue}
        - Supplies: ${supplies}
        - Prepaid Insurance: ${prepaidInsurance}
        - Investments: ${investments} // Investments is calculated by adding all the long-term assets
        - Land: ${land}
        - Land Improvements: ${landImprovements}
        - Buildings: ${buildings}
        - Equipment: ${equipment}
        - Accumulated Depreciation: ${accumDepreciation}
        - Goodwill: ${goodwill}
        - Trade Names: ${tradeNames}
        - Other Assets: ${otherAssets}
        - Liabilities:
        - Notes Payable: ${notesPayable}
        - Wages Payable: ${wagesPayable}
        - Interest Payable: ${interestPayable}
        - Taxes Payable: ${taxesPayable}
        - Warranty Liability: ${warrantyLiability}
        - Unearned Revenue: ${unearnedRevenue}
        - Bonds Payable: ${bondsPayable}
        - Equity:
        - Common Stock: ${commonStock}
        - Other Comprehensive Income: ${otherComprehensiveIncome}
        - Treasury Stock: ${treasuryStock}
        - Retained Earnings: // Retained Earnings is calculated by subtracting total liabilities from total assets
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
    <form >
      <h2>Balance Sheet</h2>

      <h3>Detailed Assets</h3>
      <h4>Current Assets</h4>
        <input type="number" placeholder="Cash" value={cash} onChange={(e) => setCash(e.target.value)} />
      <input type="number" placeholder="Petty Cash" value={pettyCash} onChange={(e) => setPettyCash(e.target.value)} />
      <input type="number" placeholder="Temporary Investments" value={temporaryInvestments} onChange={(e) => setTemporaryInvestments(e.target.value)} />
        <input type="number" placeholder="Accounts Receivable" value={accountsReceivable} onChange={(e) => setAccountsReceivable(e.target.value)} />
      <input type="number" placeholder="Supplies" value={supplies} onChange={(e) => setSupplies(e.target.value)} />
      <input type="number" placeholder="Prepaid Insurance" value={prepaidInsurance} onChange={(e) => setPrepaidInsurance(e.target.value)} />

      <h4>Long-term Assets</h4>
      <input type="number" placeholder="Land" value={land} onChange={(e) => setLand(e.target.value)} />
        <input type="number" placeholder="Investments" value={investments} onChange={(e) => setInvestments(e.target.value)} />
      <input type="number" placeholder="Land Improvements" value={landImprovements} onChange={(e) => setLandImprovements(e.target.value)} />
      <input type="number" placeholder="Buildings" value={buildings} onChange={(e) => setBuildings(e.target.value)} />
      <input type="number" placeholder="Equipment" value={equipment} onChange={(e) => setEquipment(e.target.value)} />
      <input type="number" placeholder="Accumulated Depreciation" value={accumDepreciation} onChange={(e) => setAccumDepreciation(e.target.value)} />
      <input type="number" placeholder="Goodwill" value={goodwill} onChange={(e) => setGoodwill(e.target.value)} />
      <input type="number" placeholder="Trade Names" value={tradeNames} onChange={(e) => setTradeNames(e.target.value)} />
      <input type="number" placeholder="Other Assets" value={otherAssets} onChange={(e) => setOtherAssets(e.target.value)} />

      <h3>Detailed Liabilities</h3>
      <h4>Current Liabilities</h4>
      <input type="number" placeholder="Notes Payable" value={notesPayable} onChange={(e) => setNotesPayable(e.target.value)} />
      <input type="number" placeholder="Wages Payable" value={wagesPayable} onChange={(e) => setWagesPayable(e.target.value)} />
      <input type="number" placeholder="Interest Payable" value={interestPayable} onChange={(e) => setInterestPayable(e.target.value)} />
      <input type="number" placeholder="Taxes Payable" value={taxesPayable} onChange={(e) => setTaxesPayable(e.target.value)} />
      <input type="number" placeholder="Warranty Liability" value={warrantyLiability} onChange={(e) => setWarrantyLiability(e.target.value)} />
      <input type="number" placeholder="Unearned Revenue" value={unearnedRevenue} onChange={(e) => setUnearnedRevenue(e.target.value)} />

      <h4>Long-term Liabilities</h4>
      <input type="number" placeholder="Bonds Payable" value={bondsPayable} onChange={(e) => setBondsPayable(e.target.value)} />

      <h3>Stockholders' Equity</h3>
      <input type="number" placeholder="Common Stock" value={commonStock} onChange={(e) => setCommonStock(e.target.value)} />
      <input type="number" placeholder="Other Comprehensive Income" value={otherComprehensiveIncome} onChange={(e) => setOtherComprehensiveIncome(e.target.value)} />
      <input type="number" placeholder="Treasury Stock" value={treasuryStock} onChange={(e) => setTreasuryStock(e.target.value)} />


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
