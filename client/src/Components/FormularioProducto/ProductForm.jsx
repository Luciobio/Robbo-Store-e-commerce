import React, {useState, useEffect, useRef} from 'react';
import './ProductForm.css';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
//------ Fin de imports -----

const urlBack = process.env.REACT_APP_API_URL;

export default function ProductFormFunction() {
	const [state, setState] = useState({
		name: null,
		price: null,
		stock: null,
		image: null,
		description: null
	});
	const [categories, setCategories] = useState([]);
	const [robots, setRobots] = useState([]);
	const [selected, setSelected] = useState({id: null});
	const referenciaForms = useRef(null);

	useEffect(() => {
		axios.get(`${urlBack}/products/category/names`).then(res => {
			const categoryTypes = res.data.map(c => ({
				name: c.name,
				id: c.id
			}));
			setCategories(categoryTypes);
		});
	}, []);

	useEffect(() => {
		axios.get(`${urlBack}/products`).then(res => {
			const robotTypes = res.data.map(c => ({
				name: c.name,
				id: c.id
			}));
			setRobots(robotTypes);
			setSelected({id: robotTypes[0] ? robotTypes[0].id : null});
		});
	}, []);

	const handleInputChange = event => setState({...state, [event.target.name]: event.target.value});

	const handleSelectChange = event => setSelected({id: event.target.value});

	const handleChecks = event => {};

	const handleAdd = event => {
		event.preventDefault();

		axios
			.post(`${urlBack}/products`, state)
			.then(response => alert(response.statusText))
			.catch(error => alert('no se pudo agregar la categoria: ' + error));

		referenciaForms.current.reset();
	};

	const handleDelete = event => {
		event.preventDefault();

		axios
			.delete(`${urlBack}/products/${selected.id}`)
			.then(response => alert(response.statusText))
			.catch(error => alert('no se pudo eliminar el robot: ' + error.message));
	};

	const handleEdit = event => {
		event.preventDefault();

		axios
			.put(`${urlBack}/products/${selected.id}`, state)
			.then(response => alert(response.statusText))
			.catch(error => alert('no se pudo editar el robot: ' + error.message));

		referenciaForms.current.reset();
	};

	return (
		<div>
			<form ref={referenciaForms} className="form">
				<h3 className="titulo">Agregar Producto</h3>

				<label htmlFor="NombreLab" className="">
					Nombre:
				</label>
				<input
					className="NameIn"
					name="name"
					type="text"
					placeholder="Nombre del Producto"
					onChange={handleInputChange}
				/>
				<br />

				<label htmlFor="CantidadLab" className="">
					Cantidad:
				</label>
				<input
					className="CantIn"
					name="stock"
					type="text"
					placeholder="Cantidad"
					onChange={handleInputChange}
				/>
				<br />

				<label htmlFor="Precio" className="">
					Precio:
				</label>
				<input
					className="Precio"
					name="price"
					type="text"
					placeholder="Precio"
					onChange={handleInputChange}
				/>
				<br />

				<label htmlFor="ImgLab" className="">
					Imagen:
				</label>
				<input
					className="ImgIn"
					name="image"
					type="text"
					placeholder="URL de la imagen"
					onChange={handleInputChange}
				/>
				<br />

				<label className="CatLab">Categoría: </label>
				<div cassName="CatList">
					{categories.map((categoria, i) => {
						return (
							<label>
								<input
									type="checkbox"
									className="checks"
									value={i}
									onChange={handleChecks}
								/>
								{categoria.name}
							</label>
						);
					})}
				</div>
				<br />

				<label className="DescLab">Descripción:</label>
				<textarea
					className="description"
					name="description"
					placeholder="Agregue descripción del producto"
					onChange={handleInputChange}
				/>
				<br />

				<button onClick={handleAdd} className="submitBtn">
					Agregar Producto
				</button>
			</form>

			<div className={'botonOpcion'}>
				<select id="select" onChange={handleSelectChange}>
					{robots.map(robot => {
						return <option value={robot.id}>{robot.name}</option>;
					})}
				</select>

				<button type="submit" className="" value="Editar" onClick={handleEdit}>
					Editar
				</button>
				<button type="submit" className="" value="Eliminar" onClick={handleDelete}>
					Eliminar
				</button>
			</div>
		</div>
	);
}
