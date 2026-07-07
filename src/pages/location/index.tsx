import {useParams} from 'react-router'
import {getLocationBySlug} from '../../shared/locationsData.ts'
import {PageLayout} from '../../layouts/PageLayout'
import {NotFoundPage} from '../not-found'

export function LocationPage() {
    const {slug} = useParams()
    const location = slug ? getLocationBySlug(slug) : undefined

    if (!location) return <NotFoundPage/>

    return (
        <PageLayout
            subtitle={location.shortName}
            showBack
            cta={{label: 'Jetzt bestellen', href: location.orderUrl}}
        >
            <main className="flex-1"/>
        </PageLayout>
    )
}
