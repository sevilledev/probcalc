import React, { useEffect, useState } from 'react'
import MathJax from 'react-mathjax'
import { Dock } from './dock'
import styApp from '../styles/app.module.css'
import styDock from '../styles/dock.module.css'


export const Calc4 = () => {
    const [lambda, set_lambda] = useState(10)
    const [kappa, set_kappa] = useState(0.5)
    const [nu, set_nu] = useState(15)
    const [s, set_s] = useState(20)
    const [S, set_S] = useState(50)

    const [run, set_Run] = useState(true)

    const [res, set_res] = useState(new Array(3).fill(0))


    const onChange = (e, setState) => {
        setState(e.target.value)
    }


    const calc = () => {
        set_lambda(+lambda)
        set_kappa(+kappa)
        set_nu(+nu)
        set_s(+s)
        set_S(+S)

        set_Run(!run)
    }


    const sum = (from, to, func) => {
        let s = 0
        for (let i = from; i <= to; i++) {
            s += func(i)
        }
        return s
    }


    let Q = +S - s


    const a = (m) => {
        if (2 <= m <= s + 1) { return (1 + (+kappa + nu) / (+lambda)) ** (m - 1) }
        else if (s + 2 <= m <= Q) { return (1 + (+kappa) / (+lambda)) ** (m - 1 - s) }
        else if (Q + 1 <= m <= S) {
            let s = 0

            for (let k = 1; k <= m - 1 - Q; k++) {
                s += a(k) * (1 + +kappa / +lambda) ** (m - 1 - Q - k)
            }

            return a(s + 1)((1 + (+kappa) / (+lambda)) ** (m - 1 - s)) - s
        }
    }


    const b = (m) => {
        return (+nu / +lambda) * ((1 + +kappa / +lambda) ** (m - 1 - Q))
    }


    const p = (m) => {
        if (m === 0) { return (1 + (+kappa / +lambda) * sum(1, +S, a)) / (1 + ((+kappa + nu) / +lambda) * sum(1, +S, a) - sum(Q + 1, +S, b)) }
        else if (m === 1) { return p(0) * (+kappa + nu) / +lambda - (+kappa / +lambda) }
        else if (2 <= m <= Q) { return a(m) * p(1) }
        else if (Q + 1 <= m <= S) { return a(m) * p(1) - b(m) * p(0) }
    }


    const RR = () => { return (+lambda + +kappa) * (1 - p(0)) }


    const P_l = p(0)


    const S_av = () => {
        let sum = 0
        for (let i = 1; i <= S; i++) {
            let r = p(i)
            let t = `p(${i})`
            console.log({ i, kappa, [t]: r })
            sum += i * r
        }
        return sum
    }


    useEffect(() => {
        set_res([RR(), P_l, S_av()])
    }, [run])


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
                        <label><MathJax.Node formula={`\\ s \\`} /></label>
                        <input type='text' name='s' value={s} onChange={(e) => onChange(e, set_s)} />
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
                    P_{l} = ${res[1]} \\\\
                    S_{av} = ${res[2]} \\\\
                \\`} />
            </div>




            <MathJax.Node formula={`\\ 
                    Q = S - s
                \\`} />


            <MathJax.Node formula={`\\ 
                    a_{m+1} =
                        \\begin{cases}
                            (1 + \\frac{\\kappa + \\nu}{\\lambda})^{m}                                                                                   & \\qquad \\text{if}\\quad 1 \\leq m \\leq s\\\\
                            (1 + \\frac{\\kappa}{\\lambda})^{m - s}                                                                                      & \\qquad \\text{if}\\quad s + 1 \\leq m \\leq Q - 1\\\\
                            a_{s + 1}(1 + \\frac{\\kappa}{\\lambda})^{m - s} - \\sum_{k=1}^{m - Q} a_{k}(1 + \\frac{\\kappa}{\\lambda})^{m - Q - k}      & \\qquad \\text{if}\\quad Q \\leq m \\leq S - 1\\\\
                        \\end{cases}
                \\`} />


            <MathJax.Node formula={`\\ 
                    b_{m+1} = \\frac{\\nu}{\\lambda}(1 + \\frac{\\kappa}{\\lambda})^{m - Q} \\qquad Q \\leq m \\leq S - 1\\\\
                \\`} />


            <MathJax.Node formula={`\\ 
                    p(0) = \\frac{1 + \\frac{\\kappa}{\\lambda} \\sum_{m=1}^{S}a_{m}}{1 + (\\frac{\\kappa + \\nu}{\\lambda}) \\sum_{m=1}^{S}a_{m} - \\sum_{m=Q+1}^{S}b_{m}}
                \\`} />


            <MathJax.Node formula={`\\ 
                    p(1) = p(0)\\frac{\\kappa + \\nu}{\\lambda} - \\frac{\\kappa}{\\lambda}
                \\`} />


            <MathJax.Node formula={`\\ 
                    p(m + 1) =
                        \\begin{cases}
                            a_{m+1} \\space p(1)                              & \\qquad \\text{if}\\quad 1 \\leq m \\leq Q - 1\\\\
                            a_{m+1} \\space p(1) - b_{m+1} \\space p(0)       & \\qquad \\text{if}\\quad Q \\leq m \\leq S - 1\\\\
                        \\end{cases}
                \\`} />


            <MathJax.Node formula={`\\ 
                    RR = (\\lambda + \\kappa)(1 - p(0)) \\qquad
                    P_{l} = p(0)  \\qquad
                    S_{av} = \\sum_{m=1}^{S} mp(m) \\qquad
                \\`} />

        </div>
    )
}