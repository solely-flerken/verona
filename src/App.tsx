import {BrowserRouter, Routes, Route} from 'react-router'
import {GatePage} from './pages/gate'
import {JobsPage} from './pages/jobs'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<GatePage/>}/>
                <Route path="/jobs" element={<JobsPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
