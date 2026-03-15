package com.project.fintrack.security;

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String path = request.getServletPath();
        return path.equals("/api/login") ||
               path.equals("/userRegistration") ||
               path.startsWith("/userRegistration") ||
               path.equals("/login") ||
               path.equals("/home") ||
               path.startsWith("/js/") ||
               path.startsWith("/css/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ") && !authHeader.equals("Bearer null")) {
            token = authHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(token);
                System.out.println("JWT Filter: Extracted username: " + username);
            } catch (Exception e) {
                System.out.println("JWT ERROR: " + e.getMessage());
                // Invalid token format, continue without authentication
            }
        }

        if (username != null &&
                (SecurityContextHolder.getContext().getAuthentication() == null ||
                 SecurityContextHolder.getContext().getAuthentication() instanceof AnonymousAuthenticationToken)) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (jwtUtil.validateToken(token, userDetails.getUsername())) {
                    System.out.println("JWT Filter: Token validated successfully for user: " + username);
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    System.out.println("JWT Filter: Token validation failed for user: " + username);
                }
            } catch (UsernameNotFoundException ex) {
                System.out.println("JWT ERROR: User not found: " + username);
                // invalid token or deleted user -> proceed without authentication
            }
        }

        filterChain.doFilter(request, response);
    }
}