import "./Profile.scss";
import React, { useEffect } from "react";
import { getUserConnected, updateUser } from "../../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  WrapItem,
  useDisclosure,
} from "@chakra-ui/react";
import { Card, CardBody, CardFooter } from "@chakra-ui/react";
import ModalRender from "../../Tools/ModalRender/ModalRender";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CardSlider from "../../Tools/CardSlider/CardSlider";
import qrUser from "../../../assets/svg/qr-provisional.svg";

const Profile = () => {
  const dispatch = useDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { userConnected, isLoading } = useSelector((state) => state.auth);
  //TODO:  falta pintar los eventos guardados (wishlist) y los eventos a los que te has inscrito (como si hicieras un pedido)
  const { avatar_url, avatar, name, surname, email, wishList, orderIds } =
    userConnected;

  useEffect(() => {
    dispatch(getUserConnected());
  }, [avatar, name, surname, email]);

  if (isLoading) {
    return <Spinner size="lg" color="red.500" />;
  }

  //al poner el interrogante evitamos errores al cargar la página
  const eventsList = orderIds?.map((order) => order.eventsIds);
  console.log("eventsList", eventsList);
  //console.log(eventsList, "eventsList")

  //TODO: Nota. No utilizar un form si vas a subir/editar fotos > hay que usar un FORM-DATA (como en postman)

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    try {
      if (event.target.avatar.files[0])
        formData.set("avatar", event.target.avatar.files[0]);
      formData.set("name", event.target.name.value);
      formData.set("surname", event.target.surname.value);
      // formData.set("email", event.target.email.value);

      dispatch(updateUser(formData));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="container-profile">
        <div className="card-profile-data">
          <Card
            className="card-profile-data"
            direction={{ base: "column", sm: "row" }}
            variant="unstyled"
            size="sm"
          >
            <div className="container-img-profile">
              <div className="img-profile">
                {avatar_url ? (
                  <>
                    <WrapItem className="wrap">
                      <Avatar
                        size="2xl"
                        name={name}
                        src={avatar_url}
                        alt="avatar-profile-image"
                      />
                      <CardBody className="footer-card-profile">
                        <ModalRender
                          modalTitle={"Edit your profile"}
                          textBtn={
                            <div className="custom-button">
                              <FontAwesomeIcon icon={faPen} />
                            </div>
                          }
                          text={
                            <>
                              <form
                                className="form-updateUser"
                                onSubmit={handleSubmit}
                              >
                                <input
                                  type="text"
                                  name="name"
                                  placeholder={name}
                                  defaultValue={name}
                                />
                                <input
                                  type="text"
                                  name="surname"
                                  placeholder={surname}
                                  defaultValue={surname}
                                />
                                <input
                                  type="file"
                                  name="avatar"
                                  id="file"
                                  className="input-avatar"
                                />

                                <Button
                                  className="btn-card"
                                  type="submit"
                                  variant="solid"
                                  colorScheme="blue"
                                >
                                  Send
                                </Button>
                              </form>
                            </>
                          }
                        />
                      </CardBody>
                    </WrapItem>
                  </>
                ) : (
                  <div></div>
                )}
              </div>
            </div>

            <Stack className="profile-data">
              <CardBody>
                <Heading title="Profile" size="lg" textAlign="center">
                  {`${name} ${surname}`}
                </Heading>
                <div>
                  <Text py="2">{email}</Text>
                </div>
              </CardBody>
              <>
              {/* <button className="btn-primary-blue">Ver QR personal</button> */}

                <Button
                  sx={{
                    backgroundColor: "#004368", // Cambia el color de fondo a azul
                    color: "white", // Cambia el color del texto a blanco
                    border: "2px solid #004368", // Agrega un borde de 2px sólido azul
                    w: "180px",
                    h: "45px"
                  }}
                  variant="unstyled"
                  onClick={onOpen}
                >
                  Ver QR personal
                </Button>

                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent
                    w="80%"
                    h="40%"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <ModalCloseButton />
                    <ModalBody 
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    >
                      <Image
                        boxSize="150px"
                        objectFit="cover"
                        src={qrUser}
                        alt="imagen qr usuario"
                      />
                      <span className="qr-footer">QR personal</span>
                    </ModalBody>

                  </ModalContent>
                </Modal>
              </>
            </Stack>
          </Card>

          <div className="container-eventsCount">
            <div className="eventsCount">
              <h2>{eventsList ? eventsList.length : "0"}</h2>
              <p>Inscritos</p>
            </div>
            <div className="eventsCount">
              <h2>0</h2>
              <p>Asistidos</p>
            </div>
            <div className="eventsCount">
              <h2>{wishList ? wishList.length : "0"}</h2>
              <p>Guardados</p>
            </div>
          </div>
        </div>

        <Divider className="divider-profile" />

        <div className="container-events-profile">
          <section className="inscritos">
            <h2 className="titulo">Inscritos</h2>
            <div className="scroll-x">
              {eventsList?.map((event) =>
                event?.map((data, i) => {
                  return (
                    <CardSlider
                      key={i}
                      _id={data._id}
                      image={data.image_url}
                      category={data.category}
                      place={data.place}
                      date={data.date}
                      time=""
                    />
                  );
                })
              )}
            </div>
          </section>

          <section className="guardados">
            <h2 className="titulo">Guardados</h2>
            <div className="scroll-x">
              {wishList?.map((wishList, i) => {
                return (
                  <CardSlider
                    key={i}
                    _id={wishList._id}
                    image={wishList.image_url}
                    category={wishList.category}
                    place={wishList.place}
                    date={wishList.date}
                    time=""
                  />
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Profile;

//TODO: verTrapping Focus within Popover para editar pefil con lapiz https://chakra-ui.com/docs/components/popover/usage
//TODO: horizontal scroll cards with animation : https://medium.com/dailyjs/horizontal-scroll-animation-fc39ae43cbe5
