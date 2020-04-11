import { useQuery, useMutation } from '@apollo/react-hooks'
import {
  TEMPLATES_QUERY,
  CREATE_TEMPLATE_MUTATION,
  UPDATE_TEMPLATE_MUTATION,
  DELETE_TEMPLATE_MUTATION
} from './index'
import { buildTemplateMetrics } from '../utils'
import { store } from '../../../../index'

const DEFAULT_TEMPLATES = []

function buildTemplatesCacheUpdater (reducer) {
  return (cache, { data }) => {
    const variables = { userId: +store.getState().user.data.id }

    const { templates } = cache.readQuery({
      variables,
      query: TEMPLATES_QUERY
    })

    cache.writeQuery({
      variables,
      query: TEMPLATES_QUERY,
      data: { templates: reducer(data, templates) }
    })
  }
}

const updateTemplatesOnDelete = buildTemplatesCacheUpdater(
  ({ template: { id: deletedId } }, templates) =>
    templates.filter(({ id }) => id !== deletedId)
)

const updateTemplatesOnCreation = buildTemplatesCacheUpdater(
  ({ template }, templates) => [template].concat(templates)
)

export function useUserTemplates (id) {
  const { data, loading, error } = useQuery(TEMPLATES_QUERY, {
    skip: !id,
    variables: {
      userId: +id
    }
  })

  return [data ? data.templates : DEFAULT_TEMPLATES, loading, error]
}

export function useCreateTemplate () {
  const [mutate, data] = useMutation(CREATE_TEMPLATE_MUTATION, {
    update: updateTemplatesOnCreation
  })

  function createTemplate (newTemplate) {
    return mutate({
      variables: {
        settings: newTemplate
      }
    }).then(({ data: { template } }) => template)
  }

  return [createTemplate, data]
}

export function useDeleteTemplate () {
  const [mutate, data] = useMutation(DELETE_TEMPLATE_MUTATION, {
    update: updateTemplatesOnDelete
  })

  function deleteTemplate ({ id }) {
    return mutate({
      variables: {
        id: +id
      }
    })
  }

  return [deleteTemplate, data]
}

export function useUpdateTemplate () {
  const [mutate, data] = useMutation(UPDATE_TEMPLATE_MUTATION)

  function updateTemplate (oldTemplate, newConfig) {
    const { id, title, project, metrics, isPublic } = oldTemplate
    const { projectId } = newConfig

    return mutate({
      variables: {
        id: +id,
        settings: {
          title: newConfig.title || title,
          isPublic: newConfig.isPublic || isPublic,
          projectId: +(projectId || project.id),
          metrics: buildTemplateMetrics(newConfig) || metrics
        }
      }
    }).then(({ data: { template } }) => Object.assign(oldTemplate, template))
  }

  return [updateTemplate, data]
}
