import React, { useEffect, useState, useMemo } from 'react'
import MathJax from 'react-mathjax'
import { Dock } from './dock'
import styApp from '../styles/app.module.css'
import styDock from '../styles/dock.module.css'

// Log wrapper function
const log = (message, data = null) => {
    if (data === null) {
        console.log(message)
    } else {
        console.log(message, JSON.stringify(data, null, 2))
    }
}

export const Calc5 = () => {
    // Parameters
    const [lambda_plus, set_lambda_plus] = useState(3.2)
    const [lambda_minus, set_lambda_minus] = useState(1)
    const [mu, set_mu] = useState(3)
    const [kappa, set_kappa] = useState(0.1)
    const [nu, set_nu] = useState(2)
    const [s, set_s] = useState(1)
    const [S, set_S] = useState(3)
    const [R, set_R] = useState(4)
    const [phi1, set_phi1] = useState(0.1)

    // Results
    const [run, set_Run] = useState(true)
    const [res, set_res] = useState(new Array(6).fill(0))

    const onChange = (e, setState) => {
        setState(e.target.value)
    }

    const calc = () => {
        log('Calculating with values:', {
            lambda_plus: +lambda_plus,
            lambda_minus: +lambda_minus,
            mu: +mu,
            kappa: +kappa,
            nu: +nu,
            s: +s,
            S: +S,
            R: +R,
            phi1: +phi1
        })
        set_lambda_plus(+lambda_plus)
        set_lambda_minus(+lambda_minus)
        set_mu(+mu)
        set_kappa(+kappa)
        set_nu(+nu)
        set_s(+s)
        set_S(+S)
        set_R(+R)
        set_phi1(+phi1)

        set_Run(!run)
    }

    // Calculate phi2 as 1 - phi1
    const phi2 = 1 - phi1

    // Basic calculations
    const theta0 = (lambda_plus * phi1) / lambda_minus
    const theta = theta0 / phi1

    log('Intermediate values:', { phi2, theta0, theta })

    // rho calculation
    const rho = (m, n) => {
        if (m > 0) {
            return Math.pow(theta, n) * (1 - theta) / (1 - Math.pow(theta, R + 1))
        } else {
            return Math.pow(theta0, n) * (1 - theta0) / (1 - Math.pow(theta0, R + 1))
        }
    }

    // Calculate effective mu
    const rho0 = rho(0, 0)
    const mu_eff = mu * (1 - rho0)

    // Calculate Q
    const Q = () => S - s

    // Memoize intermediate calculations
    const memoizedA = useMemo(() => {
        const cache = new Map()
        // Clear cache when dependencies change
        cache.clear()
        return (j) => {
            if (cache.has(j)) return cache.get(j)
            let result
            if (j === 0) result = 0
            else if (j === 1) result = 1
            else if (j <= s + 1) {
                result = Math.pow(1 + (nu/mu_eff + kappa/mu_eff), j - 1)
            } else {
                const term1 = memoizedA(s + 1) * Math.pow(1 + kappa/mu_eff, j - s)
                let sumTerm = 0
                for (let k = 1; k <= j - Q(); k++) {
                    sumTerm += memoizedA(k) * Math.pow(1 + kappa/mu_eff, j - Q() - k) * (nu/mu_eff)
                }
                result = term1 - sumTerm
            }
            cache.set(j, result)
            return result
        }
    }, [s, nu, mu_eff, kappa, lambda_plus, lambda_minus])

    const memoizedB = useMemo(() => {
        const cache = new Map()
        // Clear cache when dependencies change
        cache.clear()
        return (j) => {
            if (cache.has(j)) return cache.get(j)
            const result = j <= Q() ? 0 : (nu/mu_eff) * Math.pow(1 + kappa/mu_eff, j - Q())
            cache.set(j, result)
            return result
        }
    }, [Q, nu, mu_eff, kappa, lambda_plus, lambda_minus])

    // Memoize pi function
    const memoizedPi = useMemo(() => {
        const cache = new Map()
        // Clear cache when dependencies change
        cache.clear()
        return (m) => {
            if (cache.has(m)) return cache.get(m)
            let result
            if (m === 0) {
                let sumA = 0
                let sumB = 0
                for (let j = 1; j <= S; j++) {
                    sumA += memoizedA(j)
                }
                for (let j = Q() + 1; j <= S; j++) {
                    sumB += memoizedB(j)
                }
                result = (1 + (kappa/mu_eff) * sumA) / (1 + ((kappa + nu)/mu_eff) * sumA - sumB)
                log('pi(0) calculation:', {
                    sumA,
                    sumB,
                    kappa,
                    mu_eff,
                    nu,
                    result
                })
            } else if (m === 1) {
                result = memoizedPi(0) * ((kappa + nu)/mu_eff) - (kappa/mu_eff)
            } else {
                result = memoizedA(m) * memoizedPi(1)
            }
            cache.set(m, result)
            return result
        }
    }, [memoizedA, memoizedB, S, Q, kappa, mu_eff, nu, lambda_plus, lambda_minus])

    // Update the pi function to use the memoized version
    const pi = memoizedPi

    // Performance measures
    const S_av = () => {
        let sum = 0
        const terms = []
        for (let m = 1; m <= S; m++) {
            const term = m * pi(m)
            terms.push({ m, pi_m: pi(m), term })
            sum += term
        }
        log('S_av calculation:', { terms, sum })
        return sum
    }

    const V_av = () => {
        let sum = 0
        const terms = []
        for (let m = 0; m <= s; m++) {
            const term = pi(m)
            terms.push({ m, pi_m: pi(m), term })
            sum += term
        }
        const result = (S - s) * sum
        log('V_av calculation:', { terms, sum, result })
        return result
    }

    const RR = () => {
        const result = mu_eff * (1 - rho(1, 0)) * pi(s + 1) + kappa * (1 - pi(0))
        log('RR calculated:', result)
        return result
    }

    const L_av = () => {
        let sum = 0
        for (let n = 1; n <= R; n++) {
            const term1 = rho(0, n) * pi(0)
            const term2 = rho(1, n) * (1 - pi(0))
            sum += n * (term1 + term2)
        }
        return sum
    }

    const LR = () => {
        const term1 = lambda_plus * phi2 * pi(0) * (1 - rho(0, 0))
        const term2 = lambda_plus * rho(0, R) * pi(0)
        const term3 = lambda_plus * (1 - pi(0)) * rho(1, R)
        const term4 = lambda_minus * (pi(0) * (1 - rho(0, 0)) + (1 - pi(0)) * (1 - rho(1, 0)))

        const result = term1 + term2 + term3 + term4
        log('LR calculated:', { result, term1, term2, term3, term4 })
        return result
    }

    const sumPi = () => {
        let sum = 0
        for (let m = 0; m <= S; m++) {
            sum += pi(m)
        }
        return sum
    }

    useEffect(() => {
        log('Final results:', {
            RR: RR(),
            pi0: pi(0),
            S_av: S_av(),
            V_av: V_av(),
            L_av: L_av(),
            LR: LR(),
            sumPi: sumPi()
        })
        set_res([RR(), pi(0), S_av(), V_av(), L_av(), LR(), sumPi()])
    }, [run])

    return (
        <div className={styApp.container}>
            <Dock>
                <div className={styDock.form}>
                    <div className={styDock.formInput}>
                        <label><MathJax.Node formula={`\\lambda^+`} /></label>
                        <input type='text' name='lambda_plus' value={lambda_plus} onChange={(e) => onChange(e, set_lambda_plus)} />
                    </div>
                    <div className={styDock.formInput}>
                        <label><MathJax.Node formula={`\\lambda^-`} /></label>
                        <input type='text' name='lambda_minus' value={lambda_minus} onChange={(e) => onChange(e, set_lambda_minus)} />
                    </div>
                    <div className={styDock.formInput}>
                        <label><MathJax.Node formula={`\\mu`} /></label>
                        <input type='text' name='mu' value={mu} onChange={(e) => onChange(e, set_mu)} />
                    </div>
                    <div className={styDock.formInput}>
                        <label><MathJax.Node formula={`\\kappa`} /></label>
                        <input type='text' name='kappa' value={kappa} onChange={(e) => onChange(e, set_kappa)} />
                    </div>
                    <div className={styDock.formInput}>
                        <label><MathJax.Node formula={`\\nu`} /></label>
                        <input type='text' name='nu' value={nu} onChange={(e) => onChange(e, set_nu)} />
                    </div>
                    <div className={styDock.formInput}>
                        <label><MathJax.Node formula={`s`} /></label>
                        <input type='text' name='s' value={s} onChange={(e) => onChange(e, set_s)} />
                    </div>
                    <div className={styDock.formInput}>
                        <label><MathJax.Node formula={`S`} /></label>
                        <input type='text' name='S' value={S} onChange={(e) => onChange(e, set_S)} />
                    </div>
                    <div className={styDock.formInput}>
                        <label><MathJax.Node formula={`R`} /></label>
                        <input type='text' name='R' value={R} onChange={(e) => onChange(e, set_R)} />
                    </div>
                    <div className={styDock.formInput}>
                        <label><MathJax.Node formula={`\\varphi_1`} /></label>
                        <input type='text' name='phi1' value={phi1} onChange={(e) => onChange(e, set_phi1)} />
                    </div>
                    <div className={styDock.formInput}>
                        <button onClick={() => calc()}>Go</button>
                    </div>
                </div>
            </Dock>

            <div className={styApp.results}>
                <MathJax.Node formula={`\\
                    RR = ${res[0]} \\\\
                    P_{l} = ${res[1]} \\\\
                    S_{av} = ${res[2]} \\\\
                    V_{av} = ${res[3]} \\\\
                    L_{av} = ${res[4]} \\\\
                    LR = ${res[5]} \\\\
                    \\sum_{m=0}^{S} \\pi(m) = ${res[6]} \\\\
                \\`} />
            </div>

            <div className={styApp.formulas}>
                <MathJax.Node formula={`\\theta_0 = \\frac{\\lambda^+ \\varphi_1}{\\lambda^-}, \\theta = \\frac{\\theta_0}{\\varphi_1}`} />

                <MathJax.Node formula={`\\
                    \\rho_m(n) =
                        \\begin{cases}
                            \\theta^n \\frac{1-\\theta}{1-\\theta^{R+1}}, & m > 0, n = 0,1,\\ldots,R \\\\
                            \\theta_0^n \\frac{1-\\theta_0}{1-\\theta_0^{R+1}}, & m = 0, n = 0,1,\\ldots,R
                        \\end{cases}
                \\`} />

                <MathJax.Node formula={`Q = S - s`} />

                <MathJax.Node formula={`\\
                    a_{j+1} = a_{s+1}\\left(1+\\frac{\\kappa}{\\mu}\\right)^{j-s} - \\sum_{k=1}^{j-Q}a_k\\left(1+\\frac{\\kappa}{\\mu}\\right)^{j-Q-k}\\left(\\frac{\\nu}{\\mu}\\right) 
                \\`} />

                <MathJax.Node formula={`\\
                    b_{j+1} = \\left(\\frac{\\nu}{\\mu}\\right)\\left(1+\\frac{\\kappa}{\\mu}\\right)^{j-Q}
                \\`} />

                <MathJax.Node formula={`\\
                    \\pi(0) = \\frac{1+\\frac{\\kappa}{\\mu}\\sum_{j=1}^{S}a_j}{1+\\frac{\\kappa+\\nu}{\\mu}\\sum_{j=2}^{S}a_j-\\sum_{j=Q+1}^{S}b_j}
                \\`} />

                <MathJax.Node formula={`\\
                    \\pi(1) = \\pi(0)\\left(\\frac{\\kappa+\\nu}{\\mu}\\right)-\\left(\\frac{\\kappa}{\\mu}\\right)
                \\`} />

                <MathJax.Node formula={`\\
                    \\pi(m) = a_m\\pi(1) \\quad \\text{for } 2 \\leq m \\leq S
                \\`} />

                <MathJax.Node formula={`\\
                    S_{av} = \\sum_{m=1}^{S} m\\pi(m)
                \\`} />

                <MathJax.Node formula={`\\
                    V_{av} = (S-s)\\sum_{m=0}^{s} \\pi(m)
                \\`} />

                <MathJax.Node formula={`\\
                    RR = \\mu(1-\\rho(0))\\pi(s+1) + \\kappa(1-\\pi(0))
                \\`} />

                <MathJax.Node formula={`\\
                    L_{av} = \\sum_{n=1}^{R} n(\\rho_0(n)\\pi(0) + \\rho(n)(1-\\pi(0)))
                \\`} />

                <MathJax.Node formula={`\\
                    LR = \\lambda^+ \\varphi_2 \\pi(0)(1-\\rho_0(0)) + \\lambda^+ \\rho_0(R)\\pi(0) + \\lambda^+(1-\\pi(0))\\rho(R) + \\lambda^-(\\pi(0)(1-\\rho_0(0))+(1-\\pi(0))(1-\\rho(0)))
                \\`} />
            </div>
        </div>
    )
}