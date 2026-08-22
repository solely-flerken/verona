// Appends a hidden ASCII-art signature as an HTML comment after </html> in every statically exported page.

import {readdir, readFile, writeFile} from 'node:fs/promises'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(REPO_ROOT, 'out')

const AUTHOR = 'Website created by solely-flerken'

const SIGNATURE = `
                              && &  &                           
                           &&&&&&&&&&&                          
                           &&&&&&&&                             
                          & &&/&/&&                             
                            &&\\&     &&                        
                          &&&&&&/& &&&&                         
                         &&& &&/&  &&&& &                       
                         &   |/   /&& &&&&                      
           &               \\/~\\   /~| &&& &&                  
    &      &                \\|      /~  &&     &   &           
      &&&&&&&                |/    |/         &&&&&&&&&         
      &&&&_&_\\_\\_\\__|       /~\\  _/~   /     / _&&/&&&&     
       &&&&& &  &   /|    /~/~//~  / /   //__/  &&& &           
        &&&         \\_     /~~~     _/    /                    
                     \\_|   /~~|                                
                        \\_\\__ /~/~/|\\                        
                                  /~~                           
                     :___________./~~~\\.___________:           
                      \\                           /            
                       \\_________________________/             
                       (_)                     (_)              
`

// const SIGNATURE = `
//             &   & &    &&  &&&&
//          &&&&&&&&&&&   &&&&&&&&&
//           && &&/&&&  &&&&&&&&&&&&&&&& &
//           &&&&| &|\\&&&&&&&&/~&&&&&&/&&
//            &&&/~|\\&&&    &/&~\\&& &| &&&&&
//           &    \\/~         /|\\&  _/  &
//                  /~|/      /~/ _/
//                  /~|    /|/~/
//                   //~__\\/~
//                   /~\\|  /~\\
//                      /~\\/~
//                        /~/~
//                  (---./~~~\\.---)
//                   (           )
//                    (_________)
// `

async function findHtmlFiles(dir) {
    const entries = await readdir(dir, {withFileTypes: true})
    const files = []
    for (const entry of entries) {
        const fullPath = join(dir, entry.name)
        if (entry.isDirectory()) {
            files.push(...await findHtmlFiles(fullPath))
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            files.push(fullPath)
        }
    }
    return files
}

async function main() {
    const files = await findHtmlFiles(OUT_DIR)
    for (const file of files) {
        const content = await readFile(file, 'utf-8')
        await writeFile(file, `${content}\n<!--${AUTHOR}-->\n<!--Take a look at my beautiful bonsai tree-->\n<!--\n${SIGNATURE}\n-->\n`, 'utf-8')
    }
    console.log(`[append-signature] Appended signature comment to ${files.length} file(s) in ${OUT_DIR}`)
}

main().catch((err) => {
    console.error('[append-signature] Unexpected error:', err)
    process.exit(1)
})
