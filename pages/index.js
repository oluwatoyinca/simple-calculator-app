import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

const Keys = ({values, role, setCalcString}) => {
  const handleKeyClick = (val) => {
    const isOperator = role == 'operator'
    setCalcString(prev => {
      if (val == 'CA') return ''
      if (val == 'C') return prev.slice(0,-1)

      const isOperatorAndFirstChar = isOperator && val != '(' && prev.length == 0
      const isCloseCharAfterOpenCharOrIsExtra = val == ')' && (!prev.includes('(') || prev.replace(/[^(]/g, "").length == prev.replace(/[^)]/g, "").length)
      const isOperatorAfterOperator = isOperator  && val != '(' && isNaN(prev.slice(-1)) && prev.slice(-1) != ')'
      if (isOperatorAndFirstChar || isCloseCharAfterOpenCharOrIsExtra || isOperatorAfterOperator) return prev

      return `${prev}${val}`
    })
  }
  
  return (
    values.map((val, ind) => <span key={ind} onClick={() => handleKeyClick(val)} className={`${styles.keys} ${role == 'operator' && styles.orange}`}>{val}</span>)
  )
}

const Display = ({calcString}) => {
  const [calcResult, setCalcResult] = useState('')
  const allBracketsClosed = calcString.replace(/[^(]/g, "").length == calcString.replace(/[^)]/g, "").length
  const isNumber = !isNaN(calcString.slice(-1))
  const isClosingChar = calcString.slice(-1) == ')'

  useEffect(() => {
    if (allBracketsClosed && (isNumber || isClosingChar)) {
      try {
        const newCalcResult = eval(calcString)
        setCalcResult(newCalcResult)
      } catch(e) {
        setCalcResult('Error')
      }
    }
  }, [calcString])

  return (
    <div className={styles.display}>
      <textarea readOnly={true} value={calcString} />
      <textarea readOnly={true} value={calcResult} />
    </div>
  )
}
 
const Home = () => {
  const [calcString, setCalcString] = useState('')
  return (
    <>
      <Head>
        <title>Calculator</title>
        <meta name="description" content="Calculator App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Display calcString={calcString} />
        <div className={styles.keypad}>
          <div className={styles.sect}>
            <Keys values={[1,2,3,4,5,6,7,8,9,0]} role='number' setCalcString={setCalcString} />
          </div>
          <div className={styles.sect}>
            <Keys values={['+','-','*','/','(',')','C','CA']} role='operator' setCalcString={setCalcString} />
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
