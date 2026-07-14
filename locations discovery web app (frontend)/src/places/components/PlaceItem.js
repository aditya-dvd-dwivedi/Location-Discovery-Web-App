import React, {useState, useContext} from "react";

import './PlaceItem.css';

import Card from '../../shared/components/UIElements/Card';

import Button from '../../shared/components/FormElements/Button';

import Modal from '../../shared/components/UIElements/Modal';

import Map from '../../shared/components/UIElements/Map';

import { AuthContext } from "../../shared/context/auth-context";

const PlaceItem = props => {

    const auth=useContext(AuthContext);

    //showMap is if map is being shown
    //setShowMap is function to show it
    const[showMap,setShowMap]=useState(false);

    const [showConfirmModal, setShowConfirmMOdal] = useState(false);

    const openMapHandler = () => setShowMap(true);

    const closeMapHandler = () => setShowMap(false);

    const showDeleteWarningHandler =()=>{
        setShowConfirmMOdal(true);
    };

    const cancelDeleteHandler = ()=>{
        setShowConfirmMOdal(false);
    };

    const confirmDeleteHandler = ()=>{
        setShowConfirmMOdal(false);
        console.log('DELETE');
    };




    return (
        <React.Fragment>

            <Modal
                show={showMap}
                onCancel={closeMapHandler}
                header={props.address}
                contentClass ="place-item__modal-content"
                footerClass="place-item__modal-content"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
            <div className="map-container">
                <Map center={props.coordinates} zoom={16}/>
            </div>
            </Modal>

            {/*This is the modal for the delete button */}
            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteHandler} 
                header="Are you sure?" 
                footerClass="place-item__modal-actions" 
                footer={
                <React.Fragment>
                    <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
                    <Button inverse onClick={confirmDeleteHandler}>DELETE</Button>
                </React.Fragment>
            }>
                <p>
                    do you want to proceed and delete this?
                    it cant be undone
                </p>
            </Modal>

            <li className="place-item__image">
                <Card>

                    <div className="place-item__image">
                        <img src={props.image} alt={props.title}/>
                    </div>

                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>

                    <div className="place-item__actions">
                        <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                        {auth.isLoggedIn&&(
                            <Button to={`/places/${props.id}`}>EDIT</Button>
                        )}
                        {auth.isLoggedIn&&(
                            <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>
                        )}
                        
                    </div>

                </Card>

            </li>
        </React.Fragment>
    )

}

export default PlaceItem; 