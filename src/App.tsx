import {BrowserRouter, Routes, Route} from 'react-router'
import {GatePage} from './pages/gate'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<GatePage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
