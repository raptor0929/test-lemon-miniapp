import React, { useEffect, useState } from 'react'
import { authenticate, deposit, isWebView, TokenName, TransactionResult } from '@lemoncash/mini-app-sdk'
import './MiniApp.css'

export const MiniApp: React.FC = () => {
  const [wallet, setWallet] = useState<string | undefined>(undefined)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const handleAuthentication = async () => {
    setIsAuthenticating(true)
    setError(undefined)
    
    try {
      const result = await authenticate()
      
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
    
    try {
      const result = await deposit({
        amount: '100',
        tokenName: TokenName.USDC,
      })
      
      if (result.result === TransactionResult.SUCCESS) {
        console.log('Deposit successful:', result.data.txHash)
        alert(`Deposit successful! Transaction: ${result.data.txHash}`)
      } else if (result.result === TransactionResult.CANCELLED) {
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
                {wallet.slice(0, 8)}...{wallet.slice(-8)}
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
              {isDepositing ? 'Processing...' : 'Deposit 100 USDC'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

