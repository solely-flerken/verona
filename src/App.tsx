import {useEffect} from 'react'
import {BrowserRouter, Routes, Route, useLocation} from 'react-router'
import {GatePage} from './pages/gate'
import {ImpressumPage} from './pages/impressum'
import {JobsPage} from './pages/jobs'
import {LocationPage} from './pages/location'
import {NotFoundPage} from './pages/not-found'

function ScrollToTop() {
    const {pathname} = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])
    return null
}

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop/>
            <Routes>
                <Route path="/" element={<GatePage/>}/>
                <Route path="/impressum" element={<ImpressumPage/>}/>
                <Route path="/jobs" element={<JobsPage/>}/>
                <Route path="/:slug" element={<LocationPage/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
