import { Calc1 } from './components/calc1'
import { Calc2 } from './components/calc2'
import { Routes, Route } from 'react-router-dom'


export const App = () => {
	return (
		<Routes>
			<Route path="/calc1" element={<Calc1 />} />
			<Route path="/calc2" element={<Calc2 />} />
		</Routes>
	)
}