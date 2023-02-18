import { User } from "../../models/index.js"

class UserSeeder {
  static async seed() {
    const userData = [
      {
        email: "firsttestuser@pokemon.com",
        cryptedPassword: "password",
        userName: "firstTestUser"
      }
    ]

    for(const singleUserData of userData){
      const currentUser = await User.query().findOne({ email: singleUserData.email })
      if(!currentUser){
        await User.query().insert(singleUserData)
      }
    }
  }
}

export default UserSeeder