import React, { useState } from 'react'
import MathJax from 'react-mathjax'
import { Dock } from './dock'
import styApp from '../styles/app.module.css'
import styDock from '../styles/dock.module.css'


export const Calc3 = () => {
    const [lambda, set_lambda] = useState(2)
    const [kappa, set_kappa] = useState(4)
    const [nu, set_nu] = useState(3)
    const [S, set_S] = useState(5)
    const [res, set_res] = useState(new Array(4).fill(0))


    const onChange = (e, setState) => {
        setState(e.target.value)
    }


    const calc = () => {
        set_lambda(+lambda)
        set_kappa(+kappa)
        set_nu(+nu)

        set_res([RR(), P_1, S_av(), V_av()])
    }


    const a = (n) => { return +lambda + +kappa + (n * (+nu)) }


    const b = (m) => {
        if (m == S) { return 1 }
        else if (m == S - 1) { return a(0) / (+nu) }
        else if (m == S - 2) { return ((a(+S - m - 1) * b(+m + 1)) - lambda) / (2 * (+nu)) }
        else if (0 <= m && m < S - 2) { return ((a(+S - m - 1) * b(+m + 1)) - (lambda * b(+m + 2))) / ((+S - m) * (+nu)) }
    }


    const p = (m) => {
        if (m == S) {
            let sum = 0
            for (let i = 0; i <= S; i++) { sum += b(i) }
            return 1 / sum
        } 
        else { return b(+m) * p(+S) }
    }

    const RR = () => { return (+lambda + +kappa) * (1 - p(0)) }

    const P_1 = p(0)

    const S_av = () => {
        let sum = 0
        for (let i = 1; i <= S; i++) { sum += i * p(i) }
        return sum
    }

    const V_av = () => { return 1 - p(S) }


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
                        <input type='text' name='nu' value={nu} onChange={(e) => onChange(e, set_nu)} />
                    </div>
                    <div className={styDock.formInput}>
                        <label><MathJax.Node formula={`\\ S \\`} /></label>
                        <input type='text' name='S' value={S} onChange={(e) => onChange(e, set_S)} />
                    </div>
                    <div className={styDock.formInput}>
                        <button onClick={() => calc()}>Go</button>
                    </div>
                </div>
            </Dock>

            <div className={styApp.results}>
                <MathJax.Node formula={`\\ 
                    RR = ${res[0]} \\\\
                    P_{1} = ${res[1]} \\\\
                    S_{av} = ${res[2]} \\\\
                    V_{av} = ${res[3]} \\\\
                \\`} />
            </div>




            <MathJax.Node formula={`\\ 
                    a_{n} = \\lambda + \\kappa + n\\nu \\qquad n = 0, 1, 2, ... , S-1
                \\`} />


            <MathJax.Node formula={`\\ 
                    b_{m} =
                        \\begin{cases}
                            \\frac{1}{(S-m)\\nu}(a_{S-m-1}b_{m+1} - \\lambda b_{m+2})  & \\quad \\text{if}\\quad 0 \\leq m < S - 2\\\\
                            \\frac{1}{2\\nu}(a_{S-m-1}b_{m+1} - \\lambda) & \\quad \\text{if}\\quad m = S - 2\\\\
                            \\frac{a_{0}}{\\nu} & \\quad \\text{if}\\quad m = S - 1\\\\
                            1  & \\quad \\text{if}\\quad m = S\\\\
                        \\end{cases}
                \\`} />


            <MathJax.Node formula={`\\ 
                    p(S) = \\frac{1}{\\sum_{m=0}^{S}b_{m}}
                \\`} />


            <MathJax.Node formula={`\\ 
                    p(m) = b_{m}p(S)
                \\`} />


            <MathJax.Node formula={`\\ 
                    RR = (\\lambda + \\kappa)(1 - p(0)) \\qquad
                    P_{1} = p(0)  \\qquad
                    S_{av} = \\sum_{m=1}^{S} mp(m) \\qquad
                    V_{av} = 1 - p(S) \\qquad
                \\`} />

        </div>
    )
}