import React, {useState, useEffect, useRef, useCallback} from 'react';
import {allActions} from '../../Redux/Actions/actions';
import {useSelector, useDispatch} from 'react-redux';
import './FormularioCategoria.css';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
//------ Fin de imports -----

const urlBack = process.env.REACT_APP_API_URL;

export default function FormularioCategoria() {
	const [state, setState] = useState({name: '', description: ''});
	const [categories, setCategories] = useState([]); // [{id: 1 , name: "category 1", description: "something" }]
	const [update, setUpdate] = useState(false);
	const [selected, setSelected] = useState({id: null, name: null});
	const lista = useRef(0);

	const categorySelector = useSelector(state => state.categories.categories);
	console.log(categorySelector); // es
	const dispatch = useDispatch();

	// Updates the category list whenever there's a change
	useEffect(
		() => {
			// axios.get(`${urlBack}/products/category/names`).then(res => {
			// 	const categoryTypes = res.data.map(c => ({
			// 		name: c.name,
			// 		id: c.id
			// 	}));
			// 	setCategories(categoryTypes);
			// });
			dispatch(allActions.categoryActions.getAllCategories());
			// setCategories(categorySelector)
		},
		[update]
	);

	// When a category is selected, it fills all the forms with the data of said category
	useEffect(
		() => {
			axios.get(`${urlBack}/products/category/${selected.name}`).then(res => {
				setState({
					name: res.data ? res.data.name : '',
					description: res.data ? res.data.description : ''
				});
			});
		},
		[selected]
	);

	// Updates the state when something is written in the forms
	const handleInputChange = event => setState({...state, [event.target.name]: event.target.value});

	// Sets which category is currently being selected
	const handleSelectChange = event => {
		setSelected({
			id: event.target.value,
			name: event.target.options[event.target.selectedIndex].text
		});
	};

	// Creates a new category
	const handleAdd = event => {
		event.preventDefault();

		axios
			.post(`${urlBack}/products/category`, state)
			.then(response => {
				alert(response.statusText);
				setUpdate(!update);
				setSelected({id: null, name: null});
				lista.current.value = 0;
			})
			.catch(error => alert('no se pudo agregar la categoria: ' + error.message));
	};

	// Deletes the selected category
	const handleDelete = event => {
		event.preventDefault();

		axios
			.delete(`${urlBack}/products/category/${selected.id}`)
			.then(response => {
				alert(response.statusText);
				setUpdate(!update);
				setSelected({id: null, name: null});
				lista.current.value = 0;
			})
			.catch(error => alert('no se pudo eliminar la categoria: ' + error.message));
	};

	// Edits the selected category
	const handleEdit = event => {
		event.preventDefault();

		axios
			.put(`${urlBack}/products/category/${selected.id}`, state)
			.then(response => {
				alert(response.statusText);
				setUpdate(!update);
				setSelected({id: null, name: null});
				lista.current.value = 0;
			})
			.catch(error => alert('no se pudo editar la categoria: ' + error.message));
	};

	return (
		<form className="form" onSubmit={handleAdd}>			<div className="container">
				<h3 className="titulo">Agregar Categorías</h3>
				<br />
				<label htmlFor="nombre">Nombre:</label>
				<input
					className="form-control"
					type="text"
					name="name"
					value={state.name}
					placeholder="Categoria"
					onChange={handleInputChange}
				/>
				<br />
				<label htmlFor="descripcion" className="">
					Descripción:
				</label>
				<textarea
					className="form-control"
					name="description"
					value={state.description}
					placeholder="Ingrese una descripción de la categoría"
					onChange={handleInputChange}
				/>
				<button type="submit" className="addBtn" value="Enviar" onClick={handleAdd}>
					Agregar
				</button>

				<div>
					<br />
					<h4>Editar / Eliminar Categorías</h4>
					<div className={'botonOpcion'}>
						<select ref={lista} id="select" onChange={handleSelectChange}>
							<option selected value="0">
								Categorías...
							</option>
							{/* {categorySelector.map(categoria => {
								return <option value={categoria.id}>{categoria.name}</option>;
							})} */}
						</select>
						<button type="submit" className="editBtn" value="Editar" onClick={handleEdit}>
							Editar
						</button>

						<button
							type="submit"
							className="deleteBtn"
							value="Eliminar"
							onClick={handleDelete}
						>
							Eliminar
						</button>
					</div>
				</div>
			</div>
		</form>
	);
}
