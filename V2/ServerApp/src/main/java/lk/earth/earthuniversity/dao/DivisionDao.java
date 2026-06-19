package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Division;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DivisionDao extends JpaRepository<Division, Integer> {

    Division findByName(String name);
}
