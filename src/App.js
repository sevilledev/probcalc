import { Calc1 } from './components/calc1'
import { Calc2 } from './components/calc2'
import { Routes, Route } from 'react-router-dom'
import {Navbar} from './components/navbar'


export const App = () => {
	return (
		<>
			<Navbar />
			<Routes>
                <Route path='/*' element={<Calc2 />} />
                <Route exact path='/' element={<Calc2 />} />
				<Route path="/calc1" element={<Calc1 />} />
				<Route path="/calc2" element={<Calc2 />} />
			</Routes>
		</>
	)
}