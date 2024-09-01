import Link from 'next/link'
import React from 'react'
import Button from '../../components/Button'
import Layout from '../../components/Layout'
import Table from '../../components/Table'
import Title from '../../components/Title'
import Alert from '../../components/Alert'
import { useMutation, useQuery } from '../../lib/graphql'

// Definição da mutação para deletar uma categoria
const DELETE_CATEGORY = `
mutation deleteCategory($id: String!) {
  panelDeleteCategory(id: $id)
}
`

// Definição da consulta para obter todas as categorias
const GET_ALL_CATEGORIES = `
query {
  getAllCategories {
    id
    name
    slug
  }
}
`

const Index = () => {
  // Hook para obter todas as categorias
  const { data, mutate } = useQuery(GET_ALL_CATEGORIES)

  // Hook para executar a mutação de exclusão
  const [deleteCategory] = useMutation(DELETE_CATEGORY)

  // Estado para controlar se a exclusão está em andamento
  const [loading, setLoading] = React.useState(false)

  // Função para remover uma categoria
  const remove = id => async () => {
    setLoading(true) // Inicia o estado de carregamento
    try {
      await deleteCategory({ id }) // Executa a mutação para deletar a categoria
      mutate() // Atualiza a lista de categorias após a exclusão
    } catch (error) {
      console.error('Failed to delete category:', error)
      // Exibir uma mensagem de erro ao usuário (opcional)
    } finally {
      setLoading(false) // Finaliza o estado de carregamento
    }
  }

  return (
    <Layout>
      <Title>Gerenciar categorias</Title>
      <div className='mt-8'></div>
      <div>
        {/* Link para criar uma nova categoria */}
        <Button.Link href='/categories/create'>Criar categoria</Button.Link>
      </div>
      <div className='flex flex-col mt-8'>
        <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          {/* Mensagem de alerta se não houver categorias */}
          {data && data.getAllCategories.length === 0 && (
            <Alert>
              <p>Nenhuma categoria criada até o momento.</p>
            </Alert>
          )}
          {/* Tabela com categorias se houver alguma */}
          {data && data.getAllCategories.length > 0 && (
            <div className='align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200'>
              <Table>
                <Table.Head>
                  <Table.Th>Categorias</Table.Th>
                  <Table.Th>Ações</Table.Th>
                </Table.Head>

                <Table.Body>
                  {/* Mapeia e exibe todas as categorias */}
                  {data.getAllCategories.map(item => (
                    <Table.Tr key={item.id}>
                      <Table.Td>
                        <div className='flex items-center'>
                          <div>
                            <div className='text-sm leading-5 font-medium text-gray-900'>
                              {item.name}
                            </div>
                            <div className='text-sm leading-5 text-gray-500'>
                              {item.slug}
                            </div>
                          </div>
                        </div>
                      </Table.Td>

                      <Table.Td>
                        {/* Link para editar a categoria */}
                        <Link
                          className='text-indigo-600 hover:text-indigo-900'
                          href={`/categories/${item.id}/edit`}
                        >
                          Edit
                        </Link>{' '}
                        | | {/* Botão para remover a categoria */}
                        <button
                          disabled={loading} // Desativa o botão enquanto está carregando
                          className={`text-indigo-600 hover:text-indigo-900 bg-transparent border-none cursor-pointer ${
                            loading ? 'opacity-50' : ''
                          }`}
                          onClick={() => remove(item.id)}
                        >
                          {loading ? 'Removendo...' : 'Remover'}
                        </button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Index
