import {flushSync} from 'react-dom'
import {useNavigate} from 'react-router'

export function useViewTransitionNavigate() {
    const navigate = useNavigate()

    return (path: string) => {
        if ('startViewTransition' in document) {
            document.startViewTransition(() => {
                flushSync(() => navigate(path))
            })
        } else {
            navigate(path)
        }
    }
}
