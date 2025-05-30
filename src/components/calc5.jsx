import React, { useEffect, useState } from 'react'
import MathJax from 'react-mathjax'
import { Dock } from './dock'
import styApp from '../styles/app.module.css'
import styDock from '../styles/dock.module.css'

export const Calc5 = () => {
    // Parameters
    const [lambda_plus, set_lambda_plus] = useState(2)
    const [lambda_minus, set_lambda_minus] = useState(1)
    const [mu, set_mu] = useState(3)
    const [kappa, set_kappa] = useState(1)
    const [nu, set_nu] = useState(2)
    const [s, set_s] = useState(3)
    const [S, set_S] = useState(5)
    const [R, set_R] = useState(4)
    const [phi1, set_phi1] = useState(1)
    const [phi2, set_phi2] = useState(1)

    // Results
    const [run, set_Run] = useState(true)
    const [res, set_res] = useState(new Array(6).fill(0))

    const onChange = (e, setState) => {
        setState(e.target.value)
    }

    const calc = () => {
        set_lambda_plus(+lambda_plus)
        set_lambda_minus(+lambda_minus)
        set_mu(+mu)
        set_kappa(+kappa)
        set_nu(+nu)
        set_s(+s)
        set_S(+S)
        set_R(+R)
        set_phi1(+phi1)
        set_phi2(+phi2)

        set_Run(!run)
    }

    // Calculations
    const theta0 = () => (lambda_plus * phi1) / lambda_minus
    const theta = () => theta0() / phi1

    // State probabilities within split models
    const rho = (m, n) => {
        if (m > 0) {
            return Math.pow(theta(), n) * (1 - theta()) / (1 - Math.pow(theta(), R + 1))
        } else {
            return Math.pow(theta0(), n) * (1 - theta0()) / (1 - Math.pow(theta0(), R + 1))
        }
    }

    // Calculate Q
    const Q = () => S - s

    // Coefficients for state probabilities
    const a = (j) => {
        if (j <= s + 1) {
            // For j ≤ s+1, return the original value
            return Math.pow(1 + ((nu + kappa) / mu), j - 1)
        } else if (j > s + 1) {
            // For j > s+1, use the new formula from the image
            const term1 = a(s + 1) * Math.pow(1 + (kappa / mu), j - s)

            // Calculate the sum term
            let sumTerm = 0
            for (let k = 1; k <= j - Q(); k++) {
                sumTerm += a(k) * Math.pow(1 + (kappa / mu), j - Q() - k) * (nu / mu)
            }

            return term1 - sumTerm
        }
        return 0
    }

    const b = (j) => {
        if (j === 0) return 0
        return (nu / mu) * Math.pow(1 + (kappa / mu), j - Q())
    }

    // Calculate sums for pi(0) formula
    const sumA = () => {
        let sum = 0
        for (let j = 1; j <= S; j++) {
            sum += a(j)
        }
        return sum
    }

    const sumB = () => {
        let sum = 0
        for (let j = Q() + 1; j <= S; j++) {
            sum += b(j)
        }
        return sum
    }

    // Calculating probability distribution based on new formulas
    const pi = (m) => {
        if (m === 0) {
            // Formula (24) from the image
            return (1 + (kappa / mu) * sumA()) / (1 + ((kappa + nu) / mu) * sumA() - sumB())
        } else if (m === 1) {
            // Formula (23) from the image
            return pi(0) * ((kappa + nu) / mu) - (kappa / mu)
        } else if (2 <= m && m <= S) {
            return a(m) * pi(1)
        }
        return 0
    }

    // Performance measures
    const S_av = () => {
        let sum = 0
        for (let m = 1; m <= S; m++) {
            sum += m * pi(m)
        }
        return sum
    }

    const V_av = () => {
        let sum = 0
        for (let m = 0; m <= S; m++) {
            sum += pi(m)
        }
        return (S - s) * sum
    }

    const RR = () => mu * (1 - rho(0, 0)) * pi(s + 1) + kappa * (1 - pi(0))

    const L_av = () => {
        let sum = 0;
        for (let n = 1; n <= R; n++) {
            const term1 = rho(0, n) * pi(0);
            const term2 = rho(0, n) * (1 - pi(0));
            sum += n * (term1 + term2);
        }
        return sum;
    }

    const LR = () => {
        const term1 = lambda_plus * phi2 * pi(0) * (1 - rho(0, 0))
        const term2 = lambda_plus * rho(0, R) * pi(0)
        const term3 = lambda_plus * (1 - pi(0)) * rho(0, R)
        const term4 = lambda_minus * (pi(0) * (1 - rho(0, 0)) + (1 - pi(0)) * (1 - rho(0, 0)))

        return term1 + term2 + term3 + term4
    }

    useEffect(() => {
        set_res([RR(), pi(0), S_av(), V_av(), L_av(), LR()])
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
                        <label><MathJax.Node formula={`\\varphi_2`} /></label>
                        <input type='text' name='phi2' value={phi2} onChange={(e) => onChange(e, set_phi2)} />
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
                    \\pi(0) = \\frac{1+\\frac{\\kappa}{\\mu}\\sum_{j=1}^{S}a_j}{1+\\frac{\\kappa+\\nu}{\\mu}\\sum_{j=1}^{S}a_j-\\sum_{j=Q+1}^{S}b_j}
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
                    V_{av} = (S-s)\\sum_{m=0}^{S} \\pi(m)
                \\`} />

                <MathJax.Node formula={`\\
                    RR = \\mu(1-\\rho(0,0))\\pi(s+1) + \\kappa(1-\\pi(0))
                \\`} />

                <MathJax.Node formula={`\\
                    L_{av} = \\sum_{n=1}^{R} n(\\rho_0(n)\\pi(0) + \\rho_0(n)(1-\\pi(0)))
                \\`} />

                <MathJax.Node formula={`\\
                    LR = \\lambda^+ \\varphi_2 \\pi(0)(1-\\rho_0(0)) + \\lambda^+ \\rho_0(R)\\pi(0) + \\lambda^+(1-\\pi(0))\\rho_0(R) + \\lambda^-(\\pi(0)(1-\\rho_0(0))+(1-\\pi(0))(1-\\rho_0(0)))
                \\`} />
            </div>
        </div>
    )
}
