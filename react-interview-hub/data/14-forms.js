HUB.add({
  id: 'formik', title: 'Formik', short: 'Formik',
  blurb: 'Form state, validation with Yup, fields, arrays and performance. Still found in many codebases.',
  items: [
{ q: `What is Formik, and why is it used in React applications?`,
  k: `Formik is a form helper that remembers what you typed, checks it, and tells you what's wrong.`,
  a: `A form library that manages values, errors, touched state, validation and submission so you don't hand-write it. Works well with Yup. Formik uses controlled inputs and re-renders on changes; development has slowed, and many new projects choose React Hook Form, but Formik is common in existing codebases.` },
{ q: `How do you set up Formik in a React application?`,
  k: `Install the helper and wrap your form with it.`,
  a: `<code>npm i formik yup</code>, then use <code>&lt;Formik&gt;</code> or <code>useFormik</code> with <code>initialValues</code>, <code>validationSchema</code> and <code>onSubmit</code>.` },
{ q: `How do you create a basic form using Formik?`,
  k: `Say what boxes the form has, how to check them, and what to do on send.`,
  a: `Use the components for less boilerplate.`,
  c: `<Formik
  initialValues={{ email: '' }}
  validationSchema={Yup.object({ email: Yup.string().email().required() })}
  onSubmit={async values => { await subscribe(values.email) }}
>
  <Form>
    <label htmlFor="email">Email</label>
    <Field id="email" name="email" type="email" />
    <ErrorMessage name="email" component="p" />
    <button type="submit">Subscribe</button>
  </Form>
</Formik>` },
{ q: `What is the use of the Formik component?`,
  k: `The big wrapper that holds the form's memory.`,
  a: `<code>&lt;Formik&gt;</code> creates the form state and provides it through context to <code>Form</code>, <code>Field</code>, <code>ErrorMessage</code>, <code>FieldArray</code> and <code>useFormikContext</code>. Children can be elements or a render function receiving form bag props.` },
{ q: `How do you handle form state with Formik?`,
  k: `Formik keeps a notebook of what you typed, what's wrong and what you touched.`,
  a: `State lives in Formik: <code>values</code>, <code>errors</code>, <code>touched</code>, <code>isSubmitting</code>, <code>dirty</code>, <code>isValid</code>, <code>status</code>. Update with <code>handleChange</code>/<code>setFieldValue</code>/<code>setFieldTouched</code>; read via render props, <code>useFormikContext</code> or <code>useField</code>.` },
{ q: `What is the use of the useFormik hook?`,
  k: `The same helper, as a sticker instead of a wrapper.`,
  a: `<code>useFormik(config)</code> returns the form bag for building forms without Formik components; it doesn't provide context, so <code>Field</code>/<code>FieldArray</code> won't work with it. Good for small forms.`,
  c: `const f = useFormik({ initialValues: { name: '' }, onSubmit: save })
<form onSubmit={f.handleSubmit}><input {...f.getFieldProps('name')} /></form>` },
{ q: `How do you handle form submission in Formik?`,
  k: `When you press send, Formik checks everything first, then runs your job.`,
  a: `<code>onSubmit(values, helpers)</code> runs after validation passes. If it returns a promise, <code>isSubmitting</code> resets automatically when it settles. Use helpers <code>setErrors</code>/<code>setStatus</code> for server errors and <code>resetForm</code> on success.` },
{ q: `How do you perform form validation with Formik?`,
  k: `Give Formik the rules, and it marks the wrong boxes.`,
  a: `Three ways: a <code>validationSchema</code> (Yup), a <code>validate</code> function returning an errors object (sync or async), or field-level <code>validate</code> on <code>Field</code>. Control timing with <code>validateOnChange</code>/<code>validateOnBlur</code>.` },
{ q: `What is the difference between synchronous and asynchronous validation in Formik?`,
  k: `Some checks are instant; some need to ask the shop, like "is this username taken?"`,
  a: `Sync validators return an errors object immediately. Async validators return a promise (Formik awaits it; Yup tests can be async). Async checks are slower: debounce them, run on blur, and handle race conditions.` },
{ q: `How do you use Yup for schema-based validation with Formik?`,
  k: `Write one rule book for the whole form.`,
  a: `Build a Yup object schema and pass it as <code>validationSchema</code>; Formik maps Yup errors to field paths, including nested and arrays.`,
  c: `const schema = Yup.object({
  name: Yup.string().min(2).required('Name is required'),
  age: Yup.number().min(18, 'Must be 18+'),
  password: Yup.string().min(8),
  confirm: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match'),
})` },
{ q: `How do you handle custom validation in Formik?`,
  k: `Write your own special check.`,
  a: `Use the <code>validate</code> prop returning errors, field-level <code>validate</code>, or a Yup <code>.test()</code> with a custom function (can be async).`,
  c: `username: Yup.string().test('unique', 'Taken', async v => !(await isTaken(v)))` },
{ q: `What is the use of the Field component in Formik?`,
  k: `A box that automatically connects itself to the form's memory.`,
  a: `<code>&lt;Field name&gt;</code> wires an input to Formik (value, onChange, onBlur). Use <code>as</code> for select/textarea or a custom component; or the <code>useField</code> hook to build custom inputs.` },
{ q: `How do you handle nested form fields with Formik?`,
  k: `Boxes inside boxes, named with dots.`,
  a: `Use dot/bracket paths in <code>name</code> (<code>address.city</code>, <code>friends[0].name</code>) and nested initial values; errors and touched follow the same shape (use <code>getIn</code>).` },
{ q: `How do you handle dynamic forms with Formik?`,
  k: `Forms that can grow or change while you fill them.`,
  a: `Render fields from state or config, use <code>FieldArray</code> for repeating groups, conditional fields based on <code>values</code>, and Yup <code>.when()</code> for conditional rules.` },
{ q: `What is the use of the FieldArray component in Formik?`,
  k: `A list of boxes you can add to or remove from.`,
  a: `Manages array fields with helpers <code>push</code>, <code>remove</code>, <code>insert</code>, <code>move</code>, <code>replace</code>.`,
  c: `<FieldArray name="emails">{({ push, remove }) => (
  <>{values.emails.map((_, i) => (
    <div key={i}><Field name={'emails.' + i} /><button type="button" onClick={() => remove(i)}>Remove</button></div>
  ))}<button type="button" onClick={() => push('')}>Add</button></>
)}</FieldArray>` },
{ q: `How do you handle complex form interactions with Formik?`,
  k: `When one box changes, another box changes too.`,
  a: `Use <code>useFormikContext</code> in a child with an effect to react to values (auto-fill, dependent options), <code>setFieldValue</code>, Yup <code>.when()</code> for conditional validation, and split very large forms into steps with separate schemas.` },
{ q: `How do you reset the form state in Formik?`,
  k: `Wipe the form clean.`,
  a: `<code>resetForm()</code> or <code>resetForm({ values: newValues })</code> from helpers or context; <code>&lt;button type="reset"&gt;</code> inside <code>Form</code>; <code>enableReinitialize</code> to reset when <code>initialValues</code> change.` },
{ q: `How do you handle field-level validation with Formik?`,
  k: `Each box has its own little rule.`,
  a: `Pass <code>validate</code> to <code>Field</code> or <code>useField</code>: a function returning an error string or undefined (or a promise). Runs on change/blur according to settings and merges with schema errors.` },
{ q: `How do you integrate Formik with Material-UI?`,
  k: `Use pretty boxes from the MUI kit with Formik's memory.`,
  a: `Spread <code>getFieldProps</code> and map errors to MUI's <code>error</code>/<code>helperText</code>, or use <code>useField</code> in a wrapper component. The <code>formik-mui</code> package offers adapters.`,
  c: `const [field, meta] = useField('email')
<TextField {...field} label="Email" error={meta.touched && !!meta.error} helperText={meta.touched && meta.error} />` },
{ q: `How do you handle file uploads with Formik?`,
  k: `Files aren't typed, so you put the chosen file into the form yourself.`,
  a: `File inputs are uncontrolled: on change call <code>setFieldValue('file', e.currentTarget.files[0])</code>, validate type/size with Yup <code>.test()</code>, and send with <code>FormData</code> in onSubmit.` },
{ q: `How do you handle form submission errors with Formik?`,
  k: `If the shop says no, show the reason next to the right box.`,
  a: `In <code>onSubmit</code>, catch API errors and call <code>setErrors</code> with server field errors (e.g. 422 details) or <code>setStatus</code> for a form-level message.` },
{ q: `How do you access form values and errors programmatically in Formik?`,
  k: `Peek into Formik's notebook from anywhere inside the form.`,
  a: `Render props, <code>useFormikContext()</code>, <code>useField(name)</code>, or a ref to the form (<code>innerRef</code>) for outside access, plus helpers like <code>validateForm</code> and <code>setFieldValue</code>.` },
{ q: `What are some best practices for using Formik in large forms?`,
  k: `Split big forms into small pieces.`,
  a: `Split into steps or sections; use <code>FastField</code> for independent fields; avoid validating everything on every keystroke (<code>validateOnChange={false}</code>); memoize heavy children; keep schemas modular. For very large forms consider React Hook Form.` },
{ q: `How do you optimize Formik for better performance?`,
  k: `Don't redraw every box when only one changes.`,
  a: `Use <code>FastField</code> (re-renders only for its own slice), validate on blur, debounce async validation, split forms, and avoid putting the whole form in one component that reads <code>values</code>.` },
{ q: `How do you use Formik with React Native?`,
  k: `The same helper works on phones, with phone-style boxes.`,
  a: `Use <code>useFormik</code> or <code>Formik</code> render props with <code>TextInput</code>: <code>onChangeText={handleChange('email')}</code>, <code>onBlur={handleBlur('email')}</code>, <code>value={values.email}</code>, and call <code>handleSubmit</code> from a button (no <code>&lt;form&gt;</code> element).` },
  ],
});

HUB.add({
  id: 'rhf', title: 'React Hook Form', short: 'Hook Form',
  blurb: 'Fast uncontrolled forms: register, Controller, schema validation, arrays, TypeScript.',
  items: [
{ q: `What is React Hook Form, and why is it used in React applications?`,
  k: `A form helper that lets boxes look after themselves and only checks them when needed, so it's very fast.`,
  a: `A performant form library built on uncontrolled inputs and refs: minimal re-renders, small bundle, built-in validation, schema resolvers (zod, Yup, valibot), field arrays, TypeScript-first, and integration with UI libraries via <code>Controller</code>. The common default for new React forms.` },
{ q: `How do you set up React Hook Form in a React application?`,
  k: `Install it and call useForm in your form.`,
  a: `<code>npm i react-hook-form</code> (plus <code>@hookform/resolvers zod</code> for schemas) and call <code>useForm()</code>.` },
{ q: `How do you create a basic form using React Hook Form?`,
  k: `Register each box, then hand the send button to handleSubmit.`,
  a: `Call <code>useForm()</code>, spread <code>register('field', rules)</code> onto each input, and wrap your submit function with <code>handleSubmit</code>, which validates first and only calls your function with clean data. Show errors from <code>formState.errors</code> and disable the button with <code>formState.isSubmitting</code>.`,
  c: `function Signup() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  return (
    <form onSubmit={handleSubmit(async data => { await createUser(data) })}>
      <input {...register('email', { required: 'Email is required' })} />
      {errors.email && <p role="alert">{errors.email.message}</p>}
      <button disabled={isSubmitting}>Sign up</button>
    </form>
  )
}` },
{ q: `What is the use of the useForm hook in React Hook Form?`,
  k: `It's the form's brain.`,
  a: `<code>useForm(options)</code> creates the form and returns <code>register</code>, <code>handleSubmit</code>, <code>formState</code>, <code>control</code>, <code>watch</code>, <code>setValue</code>, <code>getValues</code>, <code>reset</code>, <code>trigger</code>, <code>setError</code>, etc. Options: <code>defaultValues</code>, <code>resolver</code>, <code>mode</code> (onSubmit/onBlur/onChange/all), <code>values</code>.` },
{ q: `How do you handle form state with React Hook Form?`,
  k: `The boxes keep their own letters; the brain knows if anything's wrong or changed.`,
  a: `Values live in refs/internal store; <code>formState</code> (errors, isDirty, dirtyFields, touchedFields, isSubmitting, isValid) is a proxy, so a component only re-renders for the fields of state it reads. Use <code>useFormState</code> or <code>useWatch</code> to subscribe in child components.` },
{ q: `How do you handle form validation with React Hook Form?`,
  k: `Give rules when you register each box, or one rule book for all.`,
  a: `Built-in rules in <code>register</code> (<code>required</code>, <code>min</code>, <code>max</code>, <code>minLength</code>, <code>pattern</code>, <code>validate</code>), or a schema <code>resolver</code>. Choose <code>mode</code> for when validation runs; errors appear in <code>formState.errors</code>.` },
{ q: `What is the purpose of the register function in React Hook Form?`,
  k: `It plugs a box into the brain.`,
  a: `<code>register(name, rules)</code> returns <code>{ name, ref, onChange, onBlur }</code> to spread onto a native input, registering it for value tracking and validation. Supports options like <code>valueAsNumber</code>, <code>valueAsDate</code>, <code>setValueAs</code>, <code>disabled</code>, <code>deps</code>.` },
{ q: `How do you handle custom validation in React Hook Form?`,
  k: `Write your own special rule for a box.`,
  a: `<code>validate</code> option: a function or object of functions returning true or an error message (can be async). Or schema refinements (zod <code>.refine</code>/<code>.superRefine</code>).`,
  c: `register('username', {
  validate: { noSpaces: v => !/\\s/.test(v) || 'No spaces', unique: async v => !(await isTaken(v)) || 'Taken' },
})` },
{ q: `How do you perform schema-based validation with Yup in React Hook Form?`,
  k: `Give the brain one rule book for the whole form.`,
  a: `Use <code>@hookform/resolvers</code>: <code>resolver: yupResolver(schema)</code>. zod is the more common choice today because it also infers TypeScript types.`,
  c: `const schema = yup.object({ email: yup.string().email().required() })
useForm({ resolver: yupResolver(schema) })
// zod: useForm({ resolver: zodResolver(z.object({ email: z.string().email() })) })` },
{ q: `How do you handle form submission in React Hook Form?`,
  k: `handleSubmit checks the rules first, then runs your job.`,
  a: `<code>handleSubmit(onValid, onInvalid)</code> validates, then calls onValid with typed data. If it returns a promise, <code>isSubmitting</code> stays true until it settles. Set server errors with <code>setError('email', { message })</code> or <code>setError('root.server', ...)</code>.` },
{ q: `How do you reset the form state in React Hook Form?`,
  k: `Clean the form, or fill it with new starting values.`,
  a: `<code>reset()</code> to defaults, <code>reset(newValues)</code> to new defaults (e.g. after loading data), with options to keep errors/dirty state; <code>resetField(name)</code> for one field. Or pass <code>values</code> to useForm to sync with external data.` },
{ q: `How do you handle nested fields in React Hook Form?`,
  k: `Boxes inside boxes named with dots.`,
  a: `Use dot paths in names: <code>register('address.city')</code>, <code>register('items.0.qty')</code>. Values and errors follow the same nested shape.` },
{ q: `What is the use of the Controller component in React Hook Form?`,
  k: `An adapter for fancy boxes that don't plug in normally.`,
  a: `<code>Controller</code> (or <code>useController</code>) wraps controlled components (MUI, date pickers, React Select) that don't expose a native ref, connecting <code>value</code>/<code>onChange</code>/<code>onBlur</code> to the form.`,
  c: `<Controller name="country" control={control} rules={{ required: true }}
  render={({ field, fieldState }) => <Select {...field} options={countries} error={fieldState.error} />} />` },
{ q: `How do you integrate React Hook Form with Material-UI?`,
  k: `Use the adapter for pretty MUI boxes.`,
  a: `Simple TextFields can use <code>register</code> with <code>inputRef</code>; for Select, Autocomplete, DatePicker, Checkbox use <code>Controller</code>, mapping <code>fieldState.error</code> to <code>error</code>/<code>helperText</code>.`,
  c: `<Controller name="email" control={control} render={({ field, fieldState }) =>
  <TextField {...field} label="Email" error={!!fieldState.error} helperText={fieldState.error?.message} />} />` },
{ q: `How do you handle dynamic forms with React Hook Form?`,
  k: `Add or remove boxes while filling in.`,
  a: `<code>useFieldArray({ control, name })</code> gives <code>fields</code> (with stable ids for keys) and helpers <code>append</code>, <code>remove</code>, <code>insert</code>, <code>move</code>, <code>update</code>. Use <code>shouldUnregister</code> to control whether hidden fields keep values.`,
  c: `const { fields, append, remove } = useFieldArray({ control, name: 'guests' })
{fields.map((f, i) => <div key={f.id}><input {...register('guests.' + i + '.name')} /><button type="button" onClick={() => remove(i)}>x</button></div>)}` },
{ q: `How do you handle dependent fields in React Hook Form?`,
  k: `When you pick a country, the city list changes.`,
  a: `Read with <code>watch</code>/<code>useWatch</code> to show or change dependent fields, re-validate related fields with <code>deps</code> in register or <code>trigger()</code>, and use schema conditions (zod <code>discriminatedUnion</code>, <code>superRefine</code>).`,
  c: `const country = useWatch({ control, name: 'country' })
<select {...register('city', { deps: ['country'] })}>{citiesFor(country).map(c => <option key={c}>{c}</option>)}</select>` },
{ q: `How do you handle file uploads with React Hook Form?`,
  k: `Register the file box; you get a list of chosen files.`,
  a: `<code>register('avatar')</code> on <code>type="file"</code> gives a <code>FileList</code>; validate size/type in <code>validate</code> or the schema; send with FormData in the submit handler.` },
{ q: `How do you use React Hook Form with TypeScript?`,
  k: `Tell the brain the shape of the form so every name is checked.`,
  a: `Pass a type to <code>useForm&lt;FormValues&gt;()</code> (or infer from a zod schema with <code>z.infer</code>). Field names in <code>register</code>, <code>watch</code>, <code>setValue</code> become type-checked paths, and <code>handleSubmit</code> receives typed data.` },
{ q: `What are some best practices for using React Hook Form?`,
  k: `Let boxes be free, give clear rules, and only watch what you need.`,
  a: `Always set <code>defaultValues</code>; use a schema resolver with zod for types and rules; prefer <code>register</code> over Controller where possible; subscribe narrowly (<code>useWatch</code>, <code>useFormState</code>); use <code>useFieldArray</code> ids as keys; accessible errors (<code>aria-invalid</code>, <code>role="alert"</code>); set server errors via <code>setError</code>.` },
{ q: `How do you handle form-level validation in React Hook Form?`,
  k: `A rule that looks at the whole form, like "passwords must match".`,
  a: `Use schema-level refinements (zod <code>.refine</code> with <code>path</code>), a custom <code>resolver</code>, or <code>setError('root.x')</code> for cross-field or server errors, displayed from <code>errors.root</code>.`,
  c: `z.object({ password: z.string().min(8), confirm: z.string() })
 .refine(d => d.password === d.confirm, { path: ['confirm'], message: 'Passwords must match' })` },
{ q: `How do you access form values and errors programmatically in React Hook Form?`,
  k: `Ask the brain what's in the boxes right now.`,
  a: `<code>getValues()</code> (no re-render), <code>watch()</code>/<code>useWatch</code> (subscribe), <code>formState.errors</code>, <code>getFieldState(name)</code>, <code>trigger()</code> to validate programmatically, <code>setValue</code> with <code>{ shouldValidate, shouldDirty }</code>.` },
{ q: `How do you handle form persistence with React Hook Form?`,
  k: `Save the half-filled form so it's still there if you come back.`,
  a: `Watch values and save (debounced) to sessionStorage/localStorage, then pass them as <code>defaultValues</code> or call <code>reset(saved)</code> on load. Don't persist sensitive fields like passwords.`,
  c: `useEffect(() => {
  const sub = watch(v => sessionStorage.setItem('draft', JSON.stringify(v)))
  return () => sub.unsubscribe()
}, [watch])` },
{ q: `How do you handle default values in React Hook Form?`,
  k: `The starting words in each box.`,
  a: `Provide <code>defaultValues</code> in useForm (can be an async function). For data that loads later, use the <code>values</code> option or <code>reset(data)</code>. Defaults define isDirty comparisons and should not be undefined.` },
{ q: `How do you integrate React Hook Form with Redux?`,
  k: `Let the form keep its own notes, and only tell the cupboard the final answer.`,
  a: `Keep in-progress values inside RHF; initialise <code>defaultValues</code> from a selector and dispatch an action in <code>onSubmit</code>. Syncing every keystroke into Redux defeats RHF's performance.` },
{ q: `How do you optimize forms for better performance with React Hook Form?`,
  k: `Only redraw the box that changed.`,
  a: `Uncontrolled <code>register</code>; read only needed <code>formState</code> fields; isolate watchers with <code>useWatch</code> in small children; avoid <code>watch()</code> at the root; use <code>mode: 'onBlur'</code> or onSubmit; memoize heavy field components; split large forms with <code>FormProvider</code> + <code>useFormContext</code>.` },
  ],
});
