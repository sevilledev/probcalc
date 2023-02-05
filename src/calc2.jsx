import React, { useEffect, useState } from 'react'
import MathJax from 'react-mathjax'


export const Calc2 = () => {
    const [lambda, set_lambda] = useState(2)
    const [kappa, set_kappa] = useState(4)
    const [nu_init, set_nu_init] = useState(3)
    const [s, set_s] = useState(5)
    const [a1, set_a1] = useState(0.2)
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
        set_a1(+a1)
        set_d(+d)

        set_res([RR(), P_c, S_av(), V_av()])
    }

    const alfa = (m, a1, d) => {
        return a1 + (m - 1) * d
    }

    const nu = (m) => {
        return (+nu_init) * alfa(m, a1, d)
    }

    const r = (m) => {
        if (m === 0) { return 1 }
        else if (m === s) { return (nu(s) / lambda + kappa) }
        else if (1 <= m && m <= s - 1) { return (1 / (lambda + kappa)) * (lambda * r(m + 1) + nu(m)) }
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
        return (lambda + kappa) * p(1) + kappa * sum
    }

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
            sum += i * alfa(i, a1, d)
        }
        return p(0) * sum
    }

    return (
        <div>
            <div className='form'>
                <div className='form-input'>
                    <label><MathJax.Node formula={`\\ \\lambda \\`} /></label>
                    <input type='text' name='lambda' value={lambda} onChange={(e) => onChange(e, set_lambda)} />
                </div>
                <div className='form-input'>
                    <label><MathJax.Node formula={`\\ \\kappa \\`} /></label>
                    <input type='text' name='kappa' value={kappa} onChange={(e) => onChange(e, set_kappa)} />
                </div>
                <div className='form-input'>
                    <label><MathJax.Node formula={`\\nu`} /></label>
                    <input type='text' name='nu' value={nu_init} onChange={(e) => onChange(e, set_nu_init)} />
                </div>
                <div className='form-input'>
                    <label><MathJax.Node formula={`\\ s \\`} /></label>
                    <input type='text' name='s' value={s} onChange={(e) => onChange(e, set_s)} />
                </div>
                <div className='form-input'>
                    <label><MathJax.Node formula={`\\ a1 \\`} /></label>
                    <input type='text' name='a1' value={a1} onChange={(e) => onChange(e, set_a1)} />
                </div>
                <div className='form-input'>
                    <label><MathJax.Node formula={`\\ d \\`} /></label>
                    <input type='text' name='d' value={d} onChange={(e) => onChange(e, set_d)} />
                </div>   
                <div className='form-input'>
                    <button onClick={() => calc()}>Calculate</button>
                </div>
            </div>

            <div className='results'>
                <MathJax.Node formula={`\\ 
                    RR = ${res[0]} \\\\
                    P_{c} = ${res[1]} \\\\
                    S_{av} = ${res[2]} \\\\
                    V_{av} = ${res[3]} \\\\
                \\`} />
            </div>

        </div>
    )
}