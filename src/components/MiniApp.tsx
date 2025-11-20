import React, { useEffect, useState } from 'react'
import { authenticate, callSmartContract, ChainId, deposit, isWebView, TokenName, TransactionResult } from '@lemoncash/mini-app-sdk'
import {
  getCsrfToken,
  signIn as nextAuthSignIn,
  useSession,
} from "next-auth/react";
import './MiniApp.css'

export const MiniApp: React.FC = () => {
  const [wallet, setWallet] = useState<string | undefined>(undefined)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [amount, setAmount] = useState<string>('100')

  const handleAuthentication = async () => {
    setIsAuthenticating(true)
    setError(undefined)
    
    try {
      const nonce = await getCsrfToken();
      if (!nonce) {
        throw new Error("Could not get CSRF token");
      }

      const result = await authenticate({
        chainId: ChainId.BASE_SEPOLIA,
        nonce,
      });
      
      if (result.result === TransactionResult.SUCCESS) {
        setWallet(result.data.wallet)
      } else if (result.result === TransactionResult.CANCELLED) {
        setError('Authentication was cancelled')
      } else {
        setError('Authentication failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication error')
    } finally {
      setIsAuthenticating(false)
    }
  }

  useEffect(() => {
    handleAuthentication()
  }, [])

  const handleDeposit = async () => {
    if (!wallet) return
    
    setIsDepositing(true)
    setError(undefined)

    const deadline = Math.floor(new Date().getTime() / 1000) + 3600
    
    try {
      const approveResult = await callSmartContract({
        contractAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        functionName: "approve",
        functionParams: ["0x644F71d3376b44965222829E6974Ad88459b608D", amount],
        value: "0",
        chainId: ChainId.BASE_SEPOLIA
      });

      alert('approve sent ' + approveResult.result);

      const depositResult = await callSmartContract({
        contractAddress: "0x644F71d3376b44965222829E6974Ad88459b608D",
        functionName: "deposit",
        functionParams: ["0x036CbD53842c5426634e7929541eC2318f3dCF7e", amount, "604800", deadline, "0x"],
        value: "0",
        chainId: ChainId.BASE_SEPOLIA
      });

      alert('deposit sent ' + depositResult.result);
      
      if (depositResult.result === TransactionResult.SUCCESS) {
        console.log('Deposit successful:', depositResult.data.txHash)
        alert(`Deposit successful! Transaction: ${depositResult.data.txHash}`)
      } else if (depositResult.result === TransactionResult.CANCELLED) {
        setError('Deposit was cancelled')
      } else {
        setError('Deposit failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deposit error')
    } finally {
      setIsDepositing(false)
    }
  }

  if (!isWebView()) {
    return (
      <div className="miniapp-container">
        <div className="warning-box">
          <h2>⚠️ WebView Not Detected</h2>
          <p>Please open this app in the Lemon Cash mobile app to use all features.</p>
          <p className="info-text">
            This mini app requires the Lemon Cash mobile application to function properly.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="miniapp-container">
      <div className="miniapp-card">
        <h1>🍋 Lemon Cash Mini App</h1>
        
        <div className="section">
          <h2>Wallet Status</h2>
          {isAuthenticating ? (
            <p className="status">Authenticating...</p>
          ) : wallet ? (
            <div className="wallet-info">
              <p className="status success">✅ Connected</p>
              <p className="wallet-address">
                {wallet}
              </p>
            </div>
          ) : (
            <p className="status error">❌ Not connected</p>
          )}
        </div>

        {error && (
          <div className="error-box">
            <p>{error}</p>
          </div>
        )}

        <div className="section">
          <h2>Actions</h2>
          <div className="input-group">
            <label htmlFor="amount-input">Amount (USDC):</label>
            <input
              id="amount-input"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              disabled={isDepositing}
              className="amount-input"
            />
          </div>
          <div className="button-group">
            <button 
              onClick={handleAuthentication} 
              disabled={isAuthenticating}
              className="button primary"
            >
              {isAuthenticating ? 'Authenticating...' : 'Re-authenticate'}
            </button>
            
            <button 
              onClick={handleDeposit} 
              disabled={!wallet || isDepositing}
              className="button secondary"
            >
              {isDepositing ? 'Processing...' : `Deposit ${amount} USDC`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

