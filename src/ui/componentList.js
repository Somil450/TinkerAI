export function renderComponentList(
  components
){

  return components
  .map(component => `

    <div>

      ${component.id}

    </div>

  `)
  .join('')

}