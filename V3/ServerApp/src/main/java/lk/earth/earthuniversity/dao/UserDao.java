package lk.earth.earthuniversity.dao;


import lk.earth.earthuniversity.entity.Employee;
import lk.earth.earthuniversity.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface UserDao extends JpaRepository<User,Integer> {
//    User findByUsername(String username);
@Query("SELECT u FROM User u JOIN FETCH u.employee WHERE u.username = :username")
User findByUsername(@Param("username") String username);

}
