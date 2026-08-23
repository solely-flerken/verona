import type {LocationAddress, LocationContact} from './types'
import generatedImpressum from './impressumData.generated.json'

export interface LegalInfo {
    companyName: string
    owner: string
    address: LocationAddress
    vatId: string
    contact: LocationContact
}

export const legalInfo: LegalInfo = generatedImpressum as LegalInfo
