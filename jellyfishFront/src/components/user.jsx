function User() {
  return (
    <>
      <div id="user">
        <button class="back-button"><i class='bx bx-left-arrow-alt' style='color:#ffffff' ></i></button>
        <h1>{user.name}</h1>
        <i class='bx bx-user' style='color:#ffffff' ></i>
      </div>
      <body class="bg-blue-50 text-white">
        <div id="user">
          <button class="color-white"><i class='bx bx-left-arrow-alt' ></i></button>
          <i class='bx bx-user'  ></i>
          <h1>toto</h1>
        </div>

        <h1>Your collections</h1>
      </body>
    </>
  );
}

export default User;