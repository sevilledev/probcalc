import { Routes, Route } from 'react-router-dom'
import {Navbar} from './components/navbar'
import styApp from './styles/app.module.css'

import { Calc1 } from './components/calc1'
import { Calc2 } from './components/calc2'
import { Calc3 } from './components/calc3'
import { Calc4 } from './components/calc4'
import { Calc5 } from './components/calc5'


export const App = () => {
	return (
		<div className={styApp.app}>
			<Navbar />
			<Routes>
                <Route path='/*' element={<Calc3 />} />
                <Route exact path='/' element={<Calc5 />} />
				<Route path='/calc1' element={<Calc1 />} />
				<Route path='/calc2' element={<Calc2 />} />
				<Route path='/calc3' element={<Calc3 />} />
				<Route path='/calc4' element={<Calc4 />} />
				<Route path='/calc5' element={<Calc5 />} />
			</Routes>
		</div>
	)
}