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
    
    // Results
    const [run, set_Run] = useState(true)
    const [res, set_res] = useState(new Array(4).fill(0))
    
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
    
    // Merged model probabilities
    const d = () => (nu + kappa) / (mu * (1 - rho(0, 0)))
    const b = () => kappa / (mu * (1 - rho(0, 0)))
    
    const a = (m) => {
        if (1 <= m && m <= s + 1) {
            return Math.pow(1 + d(), m - 1)
        } else if (s + 1 < m && m <= S) {
            return Math.pow(1 + d(), s) * Math.pow(1 + b(), m - s - 1)
        }
        return 0
    }
    
    const c = () => {
        let sum = 0
        for (let i = 1; i <= S; i++) {
            sum += a(i)
        }
        return sum
    }
    
    // Calculating probability distribution
    const pi = (m) => {
        if (m === 0) {
            return (1 + b() * c()) / (1 + d() * c())
        } else if (m === 1) {
            return d() * pi(0) - b()
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
            const term2 = rho(n, 0) * (1 - pi(0));
            sum += n * (term1 + term2);
        }
        return sum;
    }
    
    useEffect(() => {
        set_res([RR(), pi(0), S_av(), L_av()])
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
                    L_{av} = ${res[3]} \\\\
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

                <MathJax.Node formula={`\\
                    d = \\frac{\\nu + \\kappa}{\\mu(1-\\rho(0))}, b = \\frac{\\kappa}{\\mu(1-\\rho(0))}
                \\`} />

                <MathJax.Node formula={`\\
                    a_m = 
                        \\begin{cases}
                            (1+d)^{m-1}, & \\text{if } 1 \\leq m \\leq s+1 \\\\
                            (1+d)^s(1+b)^{m-s-1}, & \\text{if } s+1 < m \\leq S
                        \\end{cases}
                \\`} />

                <MathJax.Node formula={`c = \\sum_{m=1}^{S} a_m`} />

                <MathJax.Node formula={`\\
                    \\pi(m) = 
                        \\begin{cases}
                            \\frac{1+bc}{1+dc}, & \\text{if } m = 0 \\\\
                            d\\pi(0) - b, & \\text{if } m = 1 \\\\
                            a_m\\pi(1), & \\text{if } 2 \\leq m \\leq S
                        \\end{cases}
                \\`} />

                <MathJax.Node formula={`\\
                    S_{av} = \\sum_{m=1}^{S} m\\pi(m)
                \\`} />

                <MathJax.Node formula={`\\
                    V_{av} = (S-s)\\sum_{m=0}^{S} \\pi(m)
                \\`} />

                <MathJax.Node formula={`\\
                    RR = \\mu(1-\\rho(0))\\pi(s+1) + \\kappa(1-\\pi(0))
                \\`} />

                <MathJax.Node formula={`\\
                    L_{av} = \\sum_{n=1}^{R} n(\\rho_0(n)\\pi(0) + \\rho(n)(1-\\pi(0)))
                \\`} />
            </div>
        </div>
    )
}
