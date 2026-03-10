function User() {
  return (
    <>
      <div id="user">
        <button class="back-button"><i class='bx bx-left-arrow-alt' style='color:#ffffff' ></i></button>
        <h1>{user.name}</h1>
        <i class='bx bx-user' style='color:#ffffff' ></i>
      </div>
    </>
  );
}

export default User;