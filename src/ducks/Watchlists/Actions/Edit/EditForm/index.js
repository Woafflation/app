import React, { useState } from 'react'
import Dialog from '@santiment-network/ui/Dialog'
import Input from '@santiment-network/ui/Input'
import Label from '@santiment-network/ui/Label'
import { SCREENER } from '../../../detector'
import { useDebounce } from '../../../../../hooks/index'
import PublicityToggle from '../../ChangeVisibility/Toggle'
import Assets from './Assets'
import { useUserWatchlists } from '../../../gql/lists/hooks'
import styles from './index.module.scss'

const MIN_LENGTH = 3
const SHORT_NAME_ERROR = `The name should be at least ${MIN_LENGTH} characters`
const BAD_SYMBOLS_ERROR = "Use only letters, numbers, whitespace and _-.'/,"
const NAME_EXISTS_ERROR = 'You has already use this name'
const ALLOWED_SYMBOLS_REGEXP = /^([.\-/_' ,\w]*)$/

const EditForm = ({
  id,
  type,
  isLoading,
  toggleOpen,
  open: isOpen,
  onFormSubmit,
  defaultSettings,
  buttonLabel = 'Save',
  watchlist,
  ...props
}) => {
  const [lists] = useUserWatchlists(type)
  const [formState, setFormState] = useState(defaultSettings)
  const [isTouched, setIsTouched] = useState(false)
  const debouncedCheckName = useDebounce(checkName, 300)
  const placeholder = type === SCREENER ? 'Most price performance' : 'Favorites'

  function onSubmit (evt) {
    evt.preventDefault()
    let err = ''

    const { name, description, isPublic, listItems, error } = formState

    if (!error) {
      err = checkName(name)
    }

    if (error || err) {
      return
    }

    if (
      name === defaultSettings.name &&
      description === defaultSettings.description &&
      isPublic === defaultSettings.isPublic &&
      listItems === defaultSettings.listItems &&
      id
    ) {
      toggleOpen(false)
    } else {
      onFormSubmit({ name, description, isPublic, listItems })
    }
  }

  function checkIsTouched (key, value) {
    const normalizedValue = value || null
    const newFormState = { ...formState, [key]: normalizedValue }
    newFormState.description =
      newFormState.description === '' ? null : newFormState.description
    delete newFormState.error
    setIsTouched(
      JSON.stringify(newFormState) !== JSON.stringify(defaultSettings)
    )
  }

  function onInputChange ({ currentTarget: { value: name } }) {
    setFormState(state => ({ ...state, name }))
    debouncedCheckName(name)
  }

  function onTextareaChange ({ currentTarget: { value: description } }) {
    setFormState(state => ({ ...state, description }))
    checkIsTouched('description', description)
  }

  function onToggleClick (evt) {
    evt.preventDefault()
    setFormState(state => {
      const isPublic = !state.isPublic
      checkIsTouched('isPublic', isPublic)
      return { ...state, isPublic }
    })
  }

  function checkName (name = '') {
    let error = ''
    const comparedName = name.trim().toLowerCase()
    const hasSameName = lists.filter(
      list => list.name.toLowerCase() === comparedName
    )

    if (!comparedName || comparedName.length < MIN_LENGTH) {
      error = SHORT_NAME_ERROR
    }

    if (!ALLOWED_SYMBOLS_REGEXP.test(comparedName)) {
      error = BAD_SYMBOLS_ERROR
    }

    if (
      hasSameName.length > 0 &&
      !(hasSameName.length === 1 && hasSameName[0].id === id)
    ) {
      error = NAME_EXISTS_ERROR
    }

    if (!error) checkIsTouched('name', name)
    setFormState(state => ({ ...state, error }))

    return error
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => toggleOpen(false)}
      onOpen={() => {
        setFormState({ ...defaultSettings })
        toggleOpen(true)
      }}
      classes={styles}
      {...props}
    >
      <form className={styles.wrapper} onSubmit={onSubmit}>
        <Label accent='waterloo' className={styles.name__label}>
          {`Name (${(formState.name && formState.name.length) || 0}/25)`}
        </Label>
        {isOpen && (
          <Input
            autoFocus
            name='name'
            maxLength='25'
            autoComplete='off'
            className={styles.input}
            onChange={onInputChange}
            isError={formState.error}
            errorText={formState.error}
            defaultValue={formState.name}
            placeholder={'For example, ' + placeholder}
          />
        )}
        <button
          // hack for submiting form
          type='submit'
          style={{ display: 'none' }}
        />
        <Label accent='waterloo' className={styles.description__label}>
          Description (optional)
        </Label>
        {isOpen && (
          <textarea
            name='description'
            className={styles.textarea}
            onChange={onTextareaChange}
            defaultValue={formState.description}
            placeholder='Add a description'
          />
        )}
        {isOpen && (
          <Assets
            watchlist={watchlist}
            onChange={listItems => {
              setFormState(state => ({ ...state, listItems }))
              checkIsTouched('listItems', listItems)
            }}
          />
        )}
        <div className={styles.actions}>
          <Dialog.Approve
            className={styles.btn}
            accent='positive'
            isLoading={isLoading}
            disabled={
              isLoading ||
              formState.error ||
              !formState.name ||
              formState.name.length < MIN_LENGTH
            }
          >
            {isTouched && !formState.error ? 'Apply changes' : buttonLabel}
          </Dialog.Approve>
          <PublicityToggle
            variant='flat'
            isActive={formState.isPublic}
            onClick={onToggleClick}
            className={styles.toggle}
          />
        </div>
      </form>
    </Dialog>
  )
}

export default ({ settings = {}, ...props }) => (
  <EditForm
    {...props}
    defaultSettings={{
      name: '',
      description: '',
      isPublic: false,
      listItems: props.watchlist ? props.watchlist.listItems : [],
      ...settings
    }}
  />
)
