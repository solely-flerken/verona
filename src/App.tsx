import {BrowserRouter, Routes, Route} from 'react-router'
import {GatePage} from './pages/gate'
import {ImpressumPage} from './pages/impressum'
import {JobsPage} from './pages/jobs'
import {NotFoundPage} from './pages/not-found'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<GatePage/>}/>
                <Route path="/impressum" element={<ImpressumPage/>}/>
                <Route path="/jobs" element={<JobsPage/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
