package com.jgroup.jtasks.jwt;

import com.jgroup.jtasks.users.JTasksUserDetailService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwt;
    private final JTasksUserDetailService jTasksUserDetailService;

    @Override
    protected void doFilterInternal(HttpServletRequest req, @NonNull HttpServletResponse res, @NonNull FilterChain chain) throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            try {
                Claims claims = jwt.parse(header.substring(7));
                List<?> roles = claims.get("roles", List.class);
                var user = jTasksUserDetailService.loadUserByUsername(claims.getSubject());
                var authorities = roles.stream().map(r -> new SimpleGrantedAuthority(r.toString())).toList();
                SecurityContextHolder.getContext()
                        .setAuthentication(UsernamePasswordAuthenticationToken.authenticated(user, null, authorities));
            } catch (JwtException | IllegalArgumentException | UsernameNotFoundException e) {
                res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                res.setContentType("application/json");
                res.getWriter().write("""
                        { "message": "Invalid or expired token" }
                """);
            }
        }
        chain.doFilter(req, res);
    }
}
