import React, { useEffect, useState } from 'react'
import MathJax from 'react-mathjax'
import { Dock } from './dock'
import styApp from '../styles/app.module.css'
import styDock from '../styles/dock.module.css'


export const Calc2 = () => {
    const [lambda, set_lambda] = useState(2)
    const [kappa, set_kappa] = useState(4)
    const [nu_init, set_nu_init] = useState(3)
    const [s, set_s] = useState(5)
    const [alpha1, set_alpha1] = useState(0.2)
    const [d, set_d] = useState(0)
    const [res, set_res] = useState([0, 0, 0, 0])


    const onChange = (e, setState) => {
        setState(e.target.value)
    }


    const calc = () => {
        set_lambda(+lambda)
        set_kappa(+kappa)
        set_nu_init(+nu_init)
        set_s(+s)
        set_alpha1(+alpha1)
        set_d(+d)

        set_res([RR(), P_c, S_av(), V_av()])
    }

    const alpha = (m, alpha1, d) => {
        return +alpha1 + (m - 1) * d
    }

    const nu = (m) => {
        return (+nu_init) * alpha(m, alpha1, d)
    }

    const r = (m) => {
        if (m === 0) { return 1 }
        else if (m == s) { return (nu(+s) / +lambda + +kappa) }
        else if (1 <= m && m <= s - 1) { return (1 / (+lambda + +kappa)) * (+lambda * r(m + 1) + nu(+m)) }
    }

    const p = (m) => {
        if (m === 0) {
            let sum = 0
            for (let i = 0; i <= s; i++) {
                sum += r(i)
            }
            return 1 / sum
        }
        else { return r(m) * p(0) }
    }

    const RR = () => {
        let sum = 0
        for (let i = 2; i <= s; i++) {
            sum += p(i)
        }
        return (+lambda + +kappa) * p(1) + +kappa * sum
    }

    useEffect(() => {
        console.log(...res)
    }, [res])
    
    const P_c = p(0)

    const S_av = () => {
        let sum = 0
        for (let i = 1; i <= s; i++) {
            sum += i * p(i)
        }
        return sum
    }

    const V_av = () => {
        let sum = 0
        for (let i = 1; i <= s; i++) {
            sum += i * alpha(i, alpha1, d)
        }
        return p(0) * sum
    }

    return (
        <div>
            <Dock>
                <div className={styDock.form}>
                    <div className={styDock.formInput}>
                        <label><MathJax.Node formula={`\\ \\lambda \\`} /></label>
                        <input type='text' name='lambda' value={lambda} onChange={(e) => onChange(e, set_lambda)} />
                    </div>
                    <div className={styDock.formInput}>
                        <label><MathJax.Node formula={`\\ \\kappa \\`} /></label>
                        <input type='text' name='kappa' value={kappa} onChange={(e) => onChange(e, set_kappa)} />
                    </div>
                    <div className={styDock.formInput}>
                        <label><MathJax.Node formula={`\\nu`} /></label>
                        <input type='text' name='nu' value={nu_init} onChange={(e) => onChange(e, set_nu_init)} />
                    </div>
                    <div className={styDock.formInput}>
                        <label><MathJax.Node formula={`\\ s \\`} /></label>
                        <input type='text' name='s' value={s} onChange={(e) => onChange(e, set_s)} />
                    </div>
                    <div className={styDock.formInput}>
                        <label><MathJax.Node formula={`\\ \\alpha_{1} \\`} /></label>
                        <input type='text' name='alpha1' value={alpha1} onChange={(e) => onChange(e, set_alpha1)} />
                    </div>
                    <div className={styDock.formInput}>
                        <label><MathJax.Node formula={`\\ d \\`} /></label>
                        <input type='text' name='d' value={d} onChange={(e) => onChange(e, set_d)} />
                    </div>   
                    <div className={styDock.formInput}>
                        <button onClick={() => calc()}>Go</button>
                    </div>
                </div>
            </Dock>

            <div className={styApp.results}>
                <MathJax.Node formula={`\\ 
                    RR = ${res[0]} \\\\
                    P_{c} = ${res[1]} \\\\
                    S_{av} = ${res[2]} \\\\
                    V_{av} = ${res[3]} \\\\
                \\`} />
            </div>

            <MathJax.Node formula={`\\ 
                    \\alpha_{m} = \\alpha_{1} + (m-1) d  \\quad (\\sum_{m=1}^{s}\\alpha_{m} = 1 )
                \\`} />

            <MathJax.Node formula={`\\ 
                    \\nu_{m} = \\alpha_{m} \\nu
                \\`} />

            <MathJax.Node formula={`\\ 
                    r_{m} =
                        \\begin{cases}
                            1  & \\quad \\text{if}\\quad m \\text{ = 0}\\\\
                            \\frac{\\lambda r_{m+1} + \\nu_m}{\\lambda + \\kappa}  & \\quad \\text{if}\\quad 1 \\leq m \\leq s-1\\\\
                            \\frac{\\nu_s}{\\lambda + \\kappa} & \\quad \\text{if}\\quad m \\text{ = s}\\\\
                        \\end{cases}
                \\`} />

            <MathJax.Node formula={`\\ 
                    p(m) =
                        \\begin{cases}
                            \\frac{1}{\\sum_{m=0}^{s}r_{m}} & \\quad \\text{if}\\quad m \\text{ = 0} \\\\
                            r_{m} p(0) & \\quad \\text{if}\\quad 1 \\leq m \\leq s\\\\
                            \\end{cases}                
                \\`} />

            <MathJax.Node formula={`\\ 
                    RR = p(1)(\\lambda + \\kappa) + k \\sum_{m=2}^{s} p(m) \\qquad
                    P_{c} = p(0)  \\qquad
                    S_{av} = \\sum_{m=1}^{s} mp(m) \\qquad
                    V_{av} = p(0) \\sum_{m=1}^{s} m \\alpha_{m} \\qquad
                \\`} />

        </div>
    )
}