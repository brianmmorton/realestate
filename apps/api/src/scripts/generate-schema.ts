import 'reflect-metadata'
import { createSchema } from '../graphql/schema.js'
import fs from 'fs'
import path from 'path'

async function generateSchema() {
  try {
    await createSchema()
    
    // Write schema to both api and web directories
    const apiSchemaPath = path.join(process.cwd(), '../../schema.graphql')
    const webSchemaPath = path.join(process.cwd(), '../web/schema.graphql')
    
    // Read the generated schema file from type-graphql
    const generatedSchemaPath = path.join(process.cwd(), 'schema.graphql')
    if (fs.existsSync(generatedSchemaPath)) {
      const schemaContent = fs.readFileSync(generatedSchemaPath, 'utf8')
      
      // Write to both locations
      fs.writeFileSync(apiSchemaPath, schemaContent)
      fs.writeFileSync(webSchemaPath, schemaContent)
      
      console.log('Schema generated successfully!')
      console.log(`- API schema: ${apiSchemaPath}`)
      console.log(`- Web schema: ${webSchemaPath}`)
    } else {
      console.log('Generated schema file not found, but schema creation succeeded')
    }
  } catch (error) {
    console.error('Error generating schema:', error)
    process.exit(1)
  }
}

generateSchema() 