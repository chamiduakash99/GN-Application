package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Category;
import lk.earth.earthuniversity.entity.Usetype;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryDao extends JpaRepository<Category,Integer> {
}
