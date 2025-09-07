function ModalWithForm({
  isOpen,
  children,
  handleSubmit,
  title,
  buttonText,
  name,
}) {
  return (
    <div className={'modal${isOpen ? " modal_is-opened" : ""}'}>
      <div className="modal__container modal__container_form">
        <h2 className="modal__title">{title}</h2>
        <button
          className="modal__close-button modal__close-button_form"
          type="button"
          onClick={handleCloseModal}
        ></button>
        <form onSubmit={handleSubmit} className="modal__form" name={name}>
          {children}
        </form>
        <button className="modal__submit-button" type="submit">
          {buttonText}
        </button>
      </div>
    </div>
  );
}
export default ModalWithForm;
